import { Express, Request, Response } from "express";


function routes(app: Express) {

    // API description route
    app.get('/', (request: Request, response: Response) => {
        console.log(request.body);
        response.send('Scenario API Description Here');
    });

    // Get a List of the Genesis Scenarios
    app.get('/scenarios', (request: Request, response: Response) => {
        console.log(request.body);
        response.send('List of Genesis Scenarios');
    });
}

export default routes;