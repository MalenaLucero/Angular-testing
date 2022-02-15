import { TestBed } from "@angular/core/testing"
import { CoursesService } from "./courses.service"
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { COURSES, findLessonsForCourse } from "../../../../server/db-data"
import { Course } from "../model/course"
import { HttpErrorResponse } from "@angular/common/http"

describe('CoursesService', () => {
    let coursesService: CoursesService
    let httpTestingController: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        })

        coursesService = TestBed.inject(CoursesService)
        httpTestingController = TestBed.inject(HttpTestingController)
    })

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
            .subscribe(courses => {

                expect(courses).toBeTruthy('No courses returned')

                expect(courses.length).toBe(12, 'Incorrect number of courses')

                const course = courses.find(course => course.id == 12)

                expect(course.titles.description).toBe('Angular Testing Course')
            })
        
        const req = httpTestingController.expectOne('/api/courses')

        expect(req.request.method).toEqual('GET')

        //populating req payload with fake data
        req.flush({ payload: Object.values(COURSES)})

        
    })

    it('should find course by id', () => {
        coursesService.findCourseById(12)
            .subscribe(courses => {

                expect(courses).toBeTruthy('No course found')

                expect(courses.id).toBe(12, 'Incorrect course')
            })
        
        const req = httpTestingController.expectOne('/api/courses/12')

        expect(req.request.method).toEqual('GET')

        //populating req payload with fake data
        req.flush(COURSES[12])
    })

    //sucessfull save
    it('should save the course data', () => {
        const changes: Partial<Course> = { titles: { description: 'Testing Course'}}

        coursesService.saveCourse(12, changes)
            .subscribe(course => {
                expect(course.id).toBe(12)
            })

        const req = httpTestingController.expectOne('/api/courses/12')
        expect(req.request.method).toEqual('PUT')
        //checks if what's sent to the backend is the expected object
        expect(req.request.body.titles.description).toEqual(changes.titles.description)
        //simulation of the request response: new version of the object with modified properties
        req.flush({ ...COURSES[12], ...changes })
    })

    //save with error
    it('should give an error if save course fails', () => {
        const changes: Partial<Course> = { titles: { description: 'Testing Course'}}

        coursesService.saveCourse(12, changes)
            .subscribe(
                () => {
                    fail('The save course operation should have failed')
                },
                //this code should be executed
                (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500)
                }
            )
        
        //call that should be triggered
        const req = httpTestingController.expectOne('/api/courses/12')
        expect(req.request.method).toEqual('PUT')
        //simulation of server error
        req.flush('Save course failed', { status: 500, statusText: 'Internal Server Error' })
    })

    it('should find a list of lessons', () => {
        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy()
                expect(lessons.length).toBe(3)
            })
        
            //the url is more complex (it has query params)
            const req = httpTestingController.expectOne(
                req => req.url == '/api/lessons'
            )

            expect(req.request.method).toEqual('GET')
            //testing parameters
            expect(req.request.params.get('courseId')).toEqual('12')
            expect(req.request.params.get('filter')).toEqual('')
            expect(req.request.params.get('sortOrder')).toEqual('asc')
            expect(req.request.params.get('pageNumber')).toEqual('0')
            expect(req.request.params.get('pageSize')).toEqual('3')
                
            req.flush({
                payload: findLessonsForCourse(12).slice(0, 3)
            })
        })

    afterEach(() => {
        //verifies that only requests done through httpTestingController are made
        httpTestingController.verify()
    }) 
})