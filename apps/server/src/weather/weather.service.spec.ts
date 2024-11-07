import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
    let service: WeatherService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, WeatherService],
        }).compile();

        service = module.get<WeatherService>(WeatherService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
