import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  //instance of the component
  //utility type
  let fixture: ComponentFixture<CoursesCardListComponent>;
  //allows to query the DOM
  let el: DebugElement;

  //async is deprecated. Use waitForAsync instead
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      //imports: angular material, directives, etc
      imports: [CoursesModule]
    })
      //asynchronous process
      .compileComponents()
      .then(() => {
        
        fixture = TestBed.createComponent(CoursesCardListComponent)
        component = fixture.componentInstance;
        el = fixture.debugElement;
      })
  }))

  it("should create the component", () => {
  
    expect(component).toBeTruthy()
    //console.log(component)

  });


  it("should display the course list", () => {

    component.courses = setupCourses()
    //trigger change detection
    fixture.detectChanges()

    //console.log(el.nativeElement.outerHTML)

    const cards = el.queryAll(By.css('.course-card'))
    expect(cards).toBeTruthy('could not find cards')
    expect(cards.length).toBe(12, 'Unexpected number of courses')
  });


  it("should display the first course", () => {

    component.courses = setupCourses()
    fixture.detectChanges()
    const course = component.courses[0]
    //get first card through css
    const card = el.query(By.css('.course-card:first-child'))
    const title = card.query(By.css('mat-card-title'))
    const image = card.query(By.css('img'))
    expect(card).toBeTruthy('could not find course card')
    expect(title.nativeElement.textContent).toBe(course.titles.description)
    expect(image.nativeElement.src).toBe(course.iconUrl)
  });


});


