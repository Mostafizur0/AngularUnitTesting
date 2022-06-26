import { TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        service = TestBed.inject(HeroService);
        mockMessageService = jasmine.createSpyObj(MessageService);
        httpTestingController = TestBed.inject(HttpTestingController);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ],
        })
    })

    describe('getHero', () => {
        it('should call get with the correct url', () => {
            service.getHero(4);
        })
    })
})
