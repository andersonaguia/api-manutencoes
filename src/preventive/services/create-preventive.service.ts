import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/maintenances/entities/category.entity';
import { FrequencyEntity } from 'src/maintenances/entities/frequency.entity';
import { ResponsibleEntity } from 'src/maintenances/entities/responsible.entity';
import { FindAllCategoryService } from 'src/maintenances/services/category/findAll-category.service';
import { FindOneCategoryService } from 'src/maintenances/services/category/findOne-category.service';
import { FindAllFrequencyService } from 'src/maintenances/services/frequency/findAll-frequency.service';
import { FindOneFrequencyService } from 'src/maintenances/services/frequency/findOne-frequency.service';
import { FindAllResponsibleService } from 'src/maintenances/services/responsible/findAll-responsible.service';
import { FindOneResponsibleService } from 'src/maintenances/services/responsible/findOne-responsible.service';
import { Repository } from 'typeorm';
import { CreatePreventiveDto } from '../dto/create-preventive.dto';
import { UpdatePreventiveDto } from '../dto/update-preventive.dto';
import { PreventiveEntity } from '../entities/preventive.entity';

@Injectable()
export class CreatePreventiveService {
  constructor(
    @Inject('PREVENTIVE_REPOSITORY')
    private preventiveRepository: Repository<PreventiveEntity>,
    private findAllCategoryService: FindAllCategoryService,
    private findAllFrequency: FindAllFrequencyService,
    private findAllResponsible: FindAllResponsibleService,
    private findOneCategory: FindOneCategoryService,
    private findOneFrequency: FindOneFrequencyService,
    private findOneResponsible: FindOneResponsibleService

  ) { }

  create(preventiveData: CreatePreventiveDto): Promise<PreventiveEntity> {
    const { category, activity, frequency, responsible, last, next, sendEmail } = preventiveData;
    return new Promise(async (resolve, reject) => {
      try {
        const categoryExists = await this.findOneCategory.findOne(category);
        if (categoryExists === null) {
          reject("Categoria Inválida");
        }
        const frequencyExists = await this.findOneFrequency.findOne(frequency);
        if (frequencyExists === null) {
          reject("Frequência Inválida");
        }
        const responsibleExists = await this.findOneResponsible.findOne(responsible);
        if (responsibleExists === null) {
          reject("Responsável Inválido");
        }
        const categoryId = new CategoryEntity();
        categoryId.id = +category;

        const frequencyId = new FrequencyEntity();
        frequencyId.id = +frequency;

        const responsibleId = new ResponsibleEntity();
        responsibleId.id = +responsible;

        const preventive = this.preventiveRepository.create();
        preventive.activity = activity;
        preventive.category = categoryId;
        preventive.frequency = frequencyId;
        preventive.last = new Date(last);
        preventive.next = new Date(next);
        preventive.responsible = responsibleId;
        preventive.sendEmail = sendEmail;
        preventive.created_at = new Date();
        preventive.updated_at = new Date();

        const preventiveSaved = await this.preventiveRepository.save(preventive);
        resolve(preventiveSaved);
      } catch (error) {
        reject(error);
      }
    })
  }

  findAll() {
    return `This action returns all preventive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preventive`;
  }

  update(id: number, updatePreventiveDto: UpdatePreventiveDto) {
    return `This action updates a #${id} preventive`;
  }

  remove(id: number) {
    return `This action removes a #${id} preventive`;
  }
}
