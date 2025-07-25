import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './entities/client.entity';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientsRepository: typeof Client,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientsRepository.findOne({
      where: { email: createClientDto.email },
    });

    if (existingClient) {
      throw new ConflictException('Client with this email already exists');
    }

    return this.clientsRepository.create(createClientDto);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.findAll({
      include: ['trips'],
      order: [['createdAt', 'DESC']],
    });
  }

  async findActive(): Promise<Client[]> {
    return this.clientsRepository.findAll({
      where: { isActive: true },
      order: [['companyName', 'ASC']],
    });
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientsRepository.findByPk(id, {
      include: ['trips'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async findByIdWithTrips(id: string): Promise<Client> {
    const client = await this.clientsRepository.findByPk(id, {
      include: [
        {
          association: 'trips',
          include: ['truck', 'driver', 'expenses'],
        },
      ],
      order: [['trips', 'createdAt', 'DESC']],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);

    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClient = await this.clientsRepository.findOne({
        where: { email: updateClientDto.email },
      });
      if (existingClient) {
        throw new ConflictException('Client with this email already exists');
      }
    }

    await client.update(updateClientDto);
    return client;
  }

  async remove(id: string): Promise<void> {
    const client = await this.findById(id);
    await client.destroy();
  }

  async deactivate(id: string): Promise<Client> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<Client> {
    return this.update(id, { isActive: true });
  }

  async updateRevenue(id: string, amount: number): Promise<Client> {
    const client = await this.findById(id);
    client.totalRevenue = Number(client.totalRevenue) + amount;
    await client.save();
    return client;
  }
}