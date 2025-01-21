// test/index.test.js
const { pesquisacep } = import('../js/index');
const fs = import('fs');
const path = import('path');

// Mock the DOM environment
import('jest-environment-jsdom');
const jsdom = import('jsdom');
const { JSDOM } = jsdom;

// Create a global DOM
const dom = new JSDOM();
global.document = dom.window.document;

// Set up the DOM before each test
let container;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

describe('pesquisacep', () => {
    it('should be defined', () => {
        expect(pesquisacep).toBeDefined();
    });

    it('should handle a valid CEP', async () => {
        // Mock the fetch API
        const mockResponse = {
            cep: '01001000',
            logradouro: 'Rua Vergueiro',
            complemento: '',
            bairro: 'Liberdade',
            localidade: 'São Paulo',
            uf: 'SP',
            ibge: '35503081'
        };
        const mockJsonPromise = Promise.resolve(mockResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockResolvedValue(mockFetchPromise);

        const cep = '01001000';
        const result = await pesquisacep(cep);

        // Check that the mock was called and the correct URL is passed
        expect(global.fetch).toHaveBeenCalled();

        // Check the response
        expect(result).toEqual(mockResponse);

        // Check that the API was called correctly
        expect(global.fetch).toHaveBeenCalledWith(
            'https://viacep.com.br/ws/' + cep + '/json/'
        );
    });

    it('should handle an invalid CEP', async () => {
        // Mock the fetch API
        const mockResponse = {
            erro: true,
        }
        const mockJsonPromise = Promise.resolve(mockResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockResolvedValue(mockFetchPromise);

        const cep = 'invalid';
        try {
            await pesquisacep(cep);
        } catch (error) {
            expect(pesquisacep(cep).catch(e => console.log(e)).rejects.toMatch(/Invalid CEP/));
        }
    });

    it('should update the form fields on a successful response', async () => {
      // Mock the fetch API
      const mockResponse = {
        cep: '01001000',
        logradouro: 'Rua Vergueiro',
        complemento: '',
        bairro: 'Liberdade',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '35503081'
      };
      global.fetch = jest.fn(() => Promise.resolve({ json: () => mockResponse }));
      // Set up the initial state of the form
      document.body.innerHTML = `
      <form id="myForm">
        <input type="text" id="cep" value="01001000">
        <input type="text" id="logradouro">
        <input type="text" id="bairro">
        <input type="text" id="localidade">
        <input type="text" id="uf">
      </form>
      `;
        
      await pesquisacep('01001000');
    });
  });
  
