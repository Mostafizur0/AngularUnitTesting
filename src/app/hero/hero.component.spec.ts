import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

describe("HeroComponent", () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroComponent);
    })

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = {id: 1, name: 'pacman', strength: 23};
        //fixture.detectChanges();
        expect(fixture.componentInstance.hero.name).toBe('pacman');
    });

    it('should render the hero name in a anchor tag', () => {
        fixture.componentInstance.hero = {id: 1, name: 'pacman', strength: 23};
        fixture.detectChanges();

        let debugElementA = fixture.debugElement.query(By.css('a'));
        expect(debugElementA.nativeElement.textContent).toContain('pacman');
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('pacman');
    });
})
