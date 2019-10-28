import { HeaderVal } from '../models/Header';
import { FormVal } from '../models/FormVal';
import { isPending } from 'q';
import { FileDetails } from '../models/FileDetails';

export class TestConfiguration {

    id: string;
    userId: string;
    testName: string;
    testDescription: string;
    url: string;
    baseUrl: string;
    basePath: string;
    endpointAction: string;
    payloadBody: string;
    payloadHeaders: HeaderVal[];
    formContent: FormVal[];
    response: string;
    status: string;
    file: FileDetails;
    tenant: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.userId = obj && obj.userId || null;
        this.testName = obj && obj.testName || null;
        this.testDescription = obj && obj.testDescription || null;
        this.url = obj && obj.url || null;
        this.baseUrl = obj && obj.baseUrl || null;
        this.basePath = obj && obj.basePath || null;
        this.endpointAction = obj && obj.endpointAction || null;
        this.payloadBody = obj && obj.payloadBody || null;
        this.payloadHeaders = obj && obj.payloadHeaders || null;
        this.formContent = obj && obj.formContent || null;
        this.response = obj && obj.response || null;
        this.status = obj && obj.status || null;
        this.file = obj && obj.file || null;
        this.tenant = obj && obj.tenant || this.getTenant();
    }

    getTenant() {
        if (this.baseUrl !== null) {
            const splitString = this.baseUrl.split('/');
            return splitString[2];
        } else {
            return null;
        }

    }
}



