import axios from 'axios';
import type { AxiosError } from 'axios';
//import * as https from 'https';

//let bearerToken = '';

//{httpsAgent: new https.Agent({rejectUnauthorized: false})}
export async function loginCall(username: string, password: string): Promise<boolean> {
    try {
        const response = await axios.post('http://localhost:30080/login', {username: username, pass: password});
        console.log(response.data);
        //TODO cache bearer token
        return true;
    } catch(error) {
        const axError: AxiosError = error as AxiosError;
        if(axError.response) {
            console.log('Error in Response', axError.response);
        } else if(axError.request) {
            console.log('Error in Request', axError.request);
        } else {
            console.log('Other Error', axError);
        }
        return false;
    }
    

}