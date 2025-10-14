import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Datenschutz from './datenschutz';

vi.mock('../app_configuration/app_texts', () => ({
    datenschutz_text: 'Mocked Datenschutz Text'
}));

vi.mock('react-router-dom', async () => ({
    ...await vi.importActual('react-router-dom'),
    useNavigate: vi.fn(),
}));


describe('Datenschutz Card Tests', () => {
    it('renders without crashing', () => {
        render(
        <Router>
            <Datenschutz />
        </Router>
        );
        expect(screen.getByText('Infos')).toBeInTheDocument();
    });

    it('renders with config texts', () => {
        render(
            <Router>
                <Datenschutz />
            </Router>
            );
        const normalText = screen.getByText('Mocked Datenschutz Text');
        expect(normalText).toBeInTheDocument();
        expect(normalText).not.toHaveStyle('font-weight: bold');
    });

});
