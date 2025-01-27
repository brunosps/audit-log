
import { Injectable } from '@nestjs/common';
import { AuditLogSoapClientService } from './audit-log/audit-log-integration/services/audit-log-soap-client.service';

@Injectable()
export class SoapExampleService {
    constructor(private readonly soapClientService: AuditLogSoapClientService) { }

    async convertCurrency(fromCurrency: string, toCurrency: string, amount: number) {
        const wsdl = 'http://currencyconverter.kowabunga.net/converter.asmx?WSDL';
        const client = await this.soapClientService.createClient(wsdl, 'CurrencyConverter');


        const result = await client['ConversionRateAsync']({
            FromCurrency: fromCurrency,
            ToCurrency: toCurrency,
        });

        // O resultado da conversão será retornado no formato SOAP
        return {
            rate: result[0], // Taxa de conversão
            convertedAmount: result[0] * amount,
        };
    }
}
