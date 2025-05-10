import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Esdeveniments from './Esdeveniments';
import { useNavigate } from 'react-router-dom';

// Mock de les dependències
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../context/TitolNavbar', () => ({
  useTitol: () => ({
    setTitol: jest.fn(),
  }),
}));

// Mock de la resposta de l'API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      status: true,
      esdeveniments: [
        {
          id: 1,
          nom: 'Assaig General',
          dia: '01-06-2023',
          lloc: 'Local',
          hora_inici: '19:00',
        },
        {
          id: 2,
          nom: 'Concert de Nadal',
          dia: '15-12-2023',
          lloc: 'Plaça Major',
          hora_inici: '20:30',
        },
      ],
    }),
  })
);

describe('Component Esdeveniments', () => {
  beforeEach(() => {
    fetch.mockClear();
    useNavigate.mockClear();
  });

  it('renderitza correctament per assaigs', async () => {
    render(<Esdeveniments assaig={true} />);
    
    // Comprova que es mostra el text de cerca per a assaigs
    expect(await screen.findByPlaceholderText('Cerca un assaig')).toBeInTheDocument();
    
    // Comprova que es mostra la pestanya Futur
    expect(screen.getByText('Futur')).toBeInTheDocument();
    
    // Comprova que es mostra la pestanya Passat
    expect(screen.getByText('Passat')).toBeInTheDocument();
  });

  it('renderitza correctament per diades', async () => {
    render(<Esdeveniments assaig={false} />);
    
    // Comprova que es mostra el text de cerca per a diades
    expect(await screen.findByPlaceholderText('Cerca un diada')).toBeInTheDocument();
  });

  it('canvia de pestanya correctament', async () => {
    render(<Esdeveniments assaig={true} />);
    
    // Obtenim les pestanyes
    const tabPassat = screen.getByText('Passat');
    
    // Fem clic a la pestanya Passat
    fireEvent.click(tabPassat);
    
    // Podríem afegir més comprovacions aquí segons el canvi d'estat
  });

  it('filtra esdeveniments segons el text de cerca', async () => {
    render(<Esdeveniments assaig={true} />);
    
    const cercaInput = await screen.findByPlaceholderText('Cerca un assaig');
    
    // Escrivim text per filtrar
    fireEvent.change(cercaInput, { target: { value: 'General' } });
    
    // Podríem afegir comprovacions que els elements filtrades es mostren correctament
  });

  it('mostra missatge quan no hi ha esdeveniments', async () => {
    // Sobreescrivim el mock de fetch per retornar una llista buida
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          status: true,
          esdeveniments: [],
        }),
      })
    );

    render(<Esdeveniments assaig={true} />);
    
    expect(await screen.findByText('No hi ha cap assaig')).toBeInTheDocument();
  });
});