import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let mockHeroService;
    let HEROES: Hero[];

    beforeEach(() => {
        HEROES = [
            {'id': 1, 'name': 'black panther', 'strength': 8},
            {'id': 2, 'name': 'black mamba', 'strength': 24},
            {'id': 3, 'name': 'megamind', 'strength': 55}
        ]

        mockHeroService = jasmine.createSpyObj(['addHero', 'deleteHero', 'getHeroes']);
        component = new HeroesComponent(mockHeroService);
    })

    describe('delete', () => {
        it('should remove specific hero', () => {
            component.heroes = HEROES;
            mockHeroService.deleteHero.and.returnValue(of(true));

            component.delete(HEROES[2]);

            expect(component.heroes.length).toBe(2);
            expect(component.heroes).toContain(HEROES[0]);
            expect(component.heroes).toContain(HEROES[1]);
        })

        it('should call deleteHero', () => {
            component.heroes = HEROES;
            mockHeroService.deleteHero.and.returnValue(of(true));

            component.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalled();
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
            //expect(mockHeroService.deleteHero.subscribe).toHaveBeenCalled();
        })

        xit('should subscribe deleteHero', () => {
            component.heroes = HEROES;
            mockHeroService.deleteHero.and.returnValue(of(true));
            mockHeroService.deleteHero.subscribe.and.returnValue(of(true));

            component.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalled();
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
            expect(mockHeroService.deleteHero.subscribe).toHaveBeenCalled();
        })
    })
})

describe('HeroesComponent (shallow test)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES: Hero[];

    @Component({
        selector: 'app-hero',
        template: '<div></div>',
    })

    class FakeHeroComponent {
        @Input() hero: Hero;
    }

    beforeEach(() => {
        HEROES = [
            {'id': 1, 'name': 'black panther', 'strength': 8},
            {'id': 2, 'name': 'black mamba', 'strength': 24},
            {'id': 3, 'name': 'megamind', 'strength': 55}
        ];

        mockHeroService = jasmine.createSpyObj(['addHero', 'deleteHero', 'getHeroes']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent, 
                FakeHeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            //schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the service', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.componentInstance.heroes.length).toBe(3);
    })

    it('should create one li for each hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })
})

describe('HeroesComponent (deep test)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES: Hero[];

    beforeEach(() => {
        HEROES = [
            {'id': 1, 'name': 'black panther', 'strength': 8},
            {'id': 2, 'name': 'black mamba', 'strength': 24},
            {'id': 3, 'name': 'megamind', 'strength': 55}
        ];

        mockHeroService = jasmine.createSpyObj(['addHero', 'deleteHero', 'getHeroes']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent, 
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            //schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero in its component', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toBe(3);
        for (let i = 0; i < heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    })

    it(`should call heroService.deleteHero when the Hero component's
    delete event is called`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponentDEs[1].query(By.css('button'))
            .triggerEventHandler('click', {stopPropagation: () => {}});
        
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[1]);
    })

    it(`should call heroService.deleteHero when the Hero component's
    delete event is called (just emit the event)`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        (<HeroComponent>heroComponentDEs[1].componentInstance).delete.emit(undefined);
        
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[1]);
    })

    it(`should call heroService.deleteHero when the Hero component's
    delete event is called (use triggerEventHandler of DE)`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponentDEs[1].triggerEventHandler('delete', null);
        
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[1]);
    })

    it('should add a new hero to the hero list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        fixture.detectChanges();
        const name = 'Saitama';
        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
        const inputElem = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElem.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    })

    it('should have the correct route for the first hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub)).
                injector.get(RouterLinkDirectiveStub);
        
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/1');
    })
})
