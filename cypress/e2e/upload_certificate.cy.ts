const certificate =
    'MIIFkDCCA3igAwIBAgIVAP15kVt62m8a4p52xmbCcNCiSx8pMA0GCSqGSIb3DQEBDQUAMCMxITAfBgNVBAMMGENaRVJUQUlOTFkgRHVtbXkgUm9vdCBDQTAeFw0yMjA4MDQwNzUxNTFaFw00NzA3MjkwNzUxNTFaMCMxITAfBgNVBAMMGENaRVJUQUlOTFkgRHVtbXkgUm9vdCBDQTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAL/0bReUZnIoe4KBREDC8wf/veaEg6zu8QcxRdBdkU9z19cMkBQN9tZhuqPUzRJnEEBMjwjDWfmhqEF05l+NrDZvIy+C1qDR4MUDoanirPFL4HzyLzmwFMJcFE6kf948ZJm8B6GdzVBo/CaLaajGj5om0/Wq3I/qYlqgO9P2+CFR4BD7+bs3xqyteRcOI60K7anwJz2OTtVRLdvmPAStkJyXRTkFLB0GYpEckgvgkOANLsqwa1R7l7pFYWodtlW3ToqXwyVgvT+Dlt12oBvsLdbKuTHYH6uS1dC7Q6GDi5ph9gp4PiQHNXzzlypjy4isjKum1PQmBBYdgfXLjlpoGRP883JD5eOfo1yXOEKGOGDnwMQxHgmAiaDlQ8VL+sBm3m6LKrp9wYVgqICZrv5tVZyzQCKTx/y+2WREX6E8DHKt710vdhho4iN3XHSTfkijJ+DqTOYuOrF+DqTD/vrASNLRzRWI4crlUU0ybn3AW9MZmYlTTLwqhTmHJWUfiRcBS2bTu1arhNFsNT3G2uOu1ohQUbJyRjRlbDRKel3pFYFh9fTDrAsFZIdQhbBIXccTlMbx77ZWVa4Fy8XyhZPNIpaZrRJM3vG5UresLk4uVjWsefsWczxct83gYDBU7XDgvxsEr1yAwwGgyEBxb9PDwy3VdKZqiLPDZnAkEd/5X8bFAgMBAAGjgbowgbcwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYEFNPwTVY65qA/F1vzVV3qMUyJA+fWMB8GA1UdIwQYMBaAFNPwTVY65qA/F1vzVV3qMUyJA+fWMFQGA1UdIARNMEswSQYEVR0gADBBMD8GCCsGAQUFBwICMDMaMVVURjg6VGhpcyBpcyBhIGR1bW15IFJvb3QgQ0EgZm9yIHRlc3RpbmcgcHVycG9zZXMwDQYJKoZIhvcNAQENBQADggIBAEHWuZ71Zc0GdVbQA1NKPDa9rVkkDmoRdk6Zwx4KZ82c5DI6FeQIvldQDbTsGZf1J/74dJ7Z45GGXpepKkf/eKDCp6X2vScFG4OHa1rjqCxtJTttZlkssJm28CWyMA2tBUYvQ/+co63yBQdOgnY5m8yanTXjfHHA/P5u3FHqySrgpcWS5rcgFOe/9MD4x1hMbuRTA8upzr3ORVWSkXeR8lxY2l4RGeFEYrFxd7uBBKXJAowSKFCoLvu8OYilqPn7mEARQ//03U7eIn18tateCP4KLL2z/b8mrXTiQadXeMRnfD2YPhVwr3BNm7H29O8u1JQA2C5UeBOzl3bCsUTGTlrsqhmiREXkFKQTZcjJmFerlYTP4K2Gd/V8tD2M38l4F5VCj+gVKcYoUFgGAhSJgOHC7ARJn/6CuqonCSkDq232TjRq4/X0HEswf5MYwHVTDC6vobeQEXfdknjk7QCWZhR/HxflyD9Fjchlt+W2GHDwUMeHrbODgR5pkWJ2ocXoef4ESJtfKfylygbNm9888RnD1hHHDDQHLaL7tHKBJ57k4X8HJyqeo7+VLqEzEcEwma6nX8aSqkHPH3d2aIntFlA/2QomA4tbTCdLnRnWRmCTcPPI9+Uy9o0lXKsr1uQ4U82DDInT6YA4/9X+XlhM/oyudP8NE71Z2aHxr17kINrR';

describe('template spec', () => {
    beforeEach(() => {
        cy.session('admin-login', () => {
            cy.adminLogin(Cypress.env('ADMIN_URL'), Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'));
        });

        // Setup intercepts and visit page
        cy.intercept('POST', '/api/v1/certificates/upload').as('uploadCert');
        cy.intercept('DELETE', '/api/v1/certificates/*').as('deleteCert');
        cy.intercept('POST', '/api/v1/certificates/delete').as('bulkDeleteCert');
        cy.visit(Cypress.env('ADMIN_URL'));
    });

    it('uploadAndDeleteCertificate', () => {
        // Click on the "Certificates" menu item
        cy.get('._nav_7mj3y_74 > :nth-child(1) > :nth-child(2) > a > div > ._menuLabel_x9a1g_30').click();
        // Click on the "Upload Certificate" button
        cy.get('[title="Upload Certificate"] > .fa').click();

        // Upload the certificate file
        cy.get('#__fileUpload__fileContent').attachFile(
            {
                fileContent: Cypress.Blob.base64StringToBlob(certificate),
                fileName: 'cert.pem',
            },
            { subjectType: 'drag-n-drop' },
        );
        // Click on the "Upload" button
        cy.get('.btn-group > .btn-primary').click();

        // Wait for the API call and extract the ID
        cy.wait('@uploadCert').then(({ response }) => {
            // Check the response status is 201
            expect(response?.statusCode).to.eq(201);
            // Check the response body contains the expected UUID of the certificate
            const certId = response?.body?.uuid;
            expect(certId).to.exist;

            // Check that the certificate is present in the list
            cy.get(`tr[data-id="${certId}"]`).should('exist');

            // Use the dynamic ID in the next selector
            cy.get(`tr[data-id="${certId}"] > :nth-child(6) > div > a`).click();
            cy.get('[title="Delete"]').click();
            cy.get('.btn-danger').click();

            // Wait for the delete API call
            cy.wait('@deleteCert').then(({ response }) => {
                // Check the response status is 204
                expect(response?.statusCode).to.eq(204);
            });
        });
    });

    it('uploadAndBulkDeleteCertificate', () => {
        // Click on the "Certificates" menu item
        cy.get('._nav_7mj3y_74 > :nth-child(1) > :nth-child(2) > a > div > ._menuLabel_x9a1g_30').click();
        // Click on the "Upload Certificate" button
        cy.get('[title="Upload Certificate"] > .fa').click();

        // Upload the certificate file
        cy.get('#__fileUpload__fileContent').attachFile(
            {
                fileContent: Cypress.Blob.base64StringToBlob(certificate),
                fileName: 'cert.pem',
            },
            { subjectType: 'drag-n-drop' },
        );
        // Click on the "Upload" button
        cy.get('.btn-group > .btn-primary').click();

        // Wait for the API call and extract the ID
        cy.wait('@uploadCert').then(({ response }) => {
            // Check the response status is 201
            expect(response?.statusCode).to.eq(201);
            // Check the response body contains the expected UUID of the certificate
            const certId = response?.body?.uuid;
            expect(certId).to.exist;

            // Check that the certificate is present in the list
            cy.get(`tr[data-id="${certId}"]`).should('exist');

            cy.get(`#${certId}__checkbox__`).check();
            cy.get('[title="Delete"] > .fa').click();
            cy.get('.btn-danger').click();

            // Wait for the bulk delete API call
            cy.wait('@bulkDeleteCert').then(({ response }) => {
                // Check the response status is 200
                expect(response?.statusCode).to.eq(200);
            });

            // Refresh list of certificates
            cy.get('._refreshIcon_12h17_50').click();

            // Check that the certificate is no longer present
            cy.get(`tr[data-id="${certId}"]`).should('not.exist');
        });
    });
});
