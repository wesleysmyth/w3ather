import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
    let controller: WeatherController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WeatherController],
            providers: [ConfigService, WeatherService],
        }).compile();

        controller = module.get<WeatherController>(WeatherController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
