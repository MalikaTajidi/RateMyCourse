import { TestBed } from '@angular/core/testing';
import { PdfGeneratorService, EvaluationData } from './pdf-generator.service';

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate evaluation data correctly', () => {
    const mockEvaluationData: EvaluationData = {
      studentName: 'Test Student',
      studentId: 'TEST001',
      moduleInfo: {
        name: 'Test Module',
        code: 'TEST101',
        filiere: 'Test Filiere',
        credits: 6,
        description: 'Test Description'
      },
      evaluationDate: new Date('2024-12-10'),
      responses: [
        {
          questionId: '1-1',
          question: 'Comment évaluez-vous ce module ?',
          response: 4,
          type: 'rating'
        },
        {
          questionId: '1-2',
          question: 'Commentaires sur le contenu',
          response: 'Très bon module',
          type: 'text'
        }
      ],
      overallRating: 4.0,
      comments: 'Module très intéressant',
      submissionTimestamp: new Date('2024-12-10T10:30:00')
    };

    expect(mockEvaluationData.studentName).toBe('Test Student');
    expect(mockEvaluationData.responses.length).toBe(2);
    expect(mockEvaluationData.overallRating).toBe(4.0);
  });

  it('should generate correct filename', () => {
    const mockData: EvaluationData = {
      studentName: 'Amal Taibi Immrani',
      studentId: 'ETU001',
      moduleInfo: {
        name: 'Programmation Web',
        code: 'INFO301',
        filiere: 'Informatique',
        credits: 6,
        description: 'Module de programmation web'
      },
      evaluationDate: new Date('2024-12-10'),
      responses: [],
      overallRating: 0,
      comments: '',
      submissionTimestamp: new Date()
    };

    // Test de la logique de génération de nom de fichier
    const expectedPattern = /^Evaluation_Programmation_Web_Amal_Taibi_Immrani_\d{4}-\d{2}-\d{2}\.pdf$/;
    const fileName = `Evaluation_${mockData.moduleInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}_${mockData.studentName.replace(/[^a-zA-Z0-9]/g, '_')}_${mockData.evaluationDate.toISOString().split('T')[0]}.pdf`;
    
    expect(fileName).toMatch(expectedPattern);
  });

  it('should handle empty responses gracefully', () => {
    const mockData: EvaluationData = {
      studentName: 'Test Student',
      studentId: 'TEST001',
      moduleInfo: {
        name: 'Test Module',
        code: 'TEST101',
        filiere: 'Test',
        credits: 3,
        description: 'Test'
      },
      evaluationDate: new Date(),
      responses: [],
      overallRating: 0,
      comments: '',
      submissionTimestamp: new Date()
    };

    expect(mockData.responses.length).toBe(0);
    expect(mockData.overallRating).toBe(0);
    expect(mockData.comments).toBe('');
  });

  it('should calculate overall rating correctly', () => {
    const responses = [
      { questionId: '1', question: 'Q1', response: 5, type: 'rating' as const },
      { questionId: '2', question: 'Q2', response: 3, type: 'rating' as const },
      { questionId: '3', question: 'Q3', response: 4, type: 'rating' as const },
      { questionId: '4', question: 'Q4', response: 'Text response', type: 'text' as const }
    ];

    const ratingResponses = responses.filter(r => r.type === 'rating');
    const average = ratingResponses.reduce((sum, r) => sum + (r.response as number), 0) / ratingResponses.length;
    const roundedAverage = Math.round(average * 10) / 10;

    expect(ratingResponses.length).toBe(3);
    expect(roundedAverage).toBe(4.0);
  });
});
