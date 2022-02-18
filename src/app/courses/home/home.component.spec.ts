import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of, from} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses()
    .filter(course => course.category == 'BEGINNER')
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED')

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])
    TestBed.configureTestingModule({
      //NoopAnimationsModule: there won't be animations
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent)
        component = fixture.componentInstance
        el = fixture.debugElement
        coursesService = TestBed.inject(CoursesService)
      })
  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    //console.log('it should only display beginner')
    //console.log(beginnerCourses)
    //the test is synchronous
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses))
    fixture.detectChanges()
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    expect(tabs.length).toBe(1, 'Unexpected number of tabs')
  });


  it("should display only advanced courses", () => {
    
    coursesService.findAllCourses.and.returnValue(of(advancedCourses))
    fixture.detectChanges()
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    expect(tabs.length).toBe(1, 'Unexpected tabs found')
  
  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()))
    fixture.detectChanges()
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    expect(tabs.length).toBe(2, 'Unexpected tabs found')

  });


  it("should display advanced courses when tab clicked", fakeAsync(() => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()))
    fixture.detectChanges()
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    //simulation of click by the user
    //click utility function
    click(tabs[1])
    fixture.detectChanges()
    //animations can be asynchronous and make the tests fail
    flush()

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'))
    expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles')
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course')
  }));

  //works only with jasmine window open
  it("should display advanced courses when tab clicked - with waitForAsync", waitForAsync(() => {

    //flush and tick can't be called with waitForAsync
    //async supports http requests (in integration tests)
    coursesService.findAllCourses.and.returnValue(of(setupCourses()))
    fixture.detectChanges()
    const tabs = el.queryAll(By.css('.mat-tab-label'))
    click(tabs[1])
    fixture.detectChanges()

    //callback of waitForAsync
    fixture.whenStable().then(() => {
      console.log('whenStable()')
        const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'))
        expect(cardTitles.length).toBeGreaterThan(0, 'could not find card titles')
        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course')
      })
  }));
});


