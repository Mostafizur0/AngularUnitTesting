import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ]
        })

        service = TestBed.inject(HeroService);
        httpTestingController = TestBed.inject(HttpTestingController);
    })

    describe('getHero', () => {
        it('should call get with the correct url (using inject method)', 
        inject([HeroService, HttpTestingController], 
            (service: HeroService, controller: HttpTestingController) => {
            service.getHero(4).subscribe();
            //service.getHero(3).subscribe();
            const req = controller.expectOne('api/heroes/4');
            req.flush({id: 4, name: 'pacman', strength: 23});
            controller.verify();
        }))

        it('should call get with the correct url (using testbed)', () => {
            service.getHero(4).subscribe();
            //service.getHero(3).subscribe();
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({id: 4, name: 'pacman', strength: 23});
            httpTestingController.verify();
        })
    })
})
