
import { TestBed } from "@angular/core/testing"
import { CalculatorService } from "./calculator.service"
import { LoggerService } from "./logger.service"

//test suite
describe('CalculatorService', () => {

    let calculator: CalculatorService
    let loggerSpy: any

    beforeEach(() => {
        console.log('Calling beforeEach')
        //const logger = new LoggerService() --> actual implementation of service 
        //spyOne(logger, 'log') --> spying on a specific method

        //fake version (better approach)
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log'])
        
        TestBed.configureTestingModule({
            providers: [
                //actual instance
                CalculatorService,
                //jasmin spy (fake instance)
                //key: name of the service
                //useValue: what will be used instead of the actual service instance
                { provide: LoggerService, useValue: loggerSpy }
            ]
        })

        //calculator = new CalculatorService(loggerSpy)
        //TestBed.get was deprecated
        calculator = TestBed.inject(CalculatorService)
    })
    
    //test specification
    it('should add two numbers', () => {
        console.log('add test')
        const result = calculator.add(2, 2)
        expect(result).toBe(4)
        expect(loggerSpy.log).toHaveBeenCalledTimes(1)
    })

    //test specification
    it('should substract two numbers', () => {
        console.log('substract test')
        const result = calculator.subtract(2, 2)
        //second argument: error message
        expect(result).toBe(0, 'unexpected substraction result')
        expect(loggerSpy.log).toHaveBeenCalledTimes(1)
    })
})