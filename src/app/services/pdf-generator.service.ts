import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface EvaluationData {
  studentName: string;
  studentId: string;
  moduleInfo: {
    name: string;
    code: string;
    filiere: string;
    credits: number;
    description: string;
  };
  evaluationDate: Date;
  responses: Array<{
    questionId: string;
    question: string;
    response: string | number;
    type: 'rating' | 'text' | 'multiple-choice';
  }>;
  overallRating: number;
  comments: string;
  submissionTimestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  /**
   * Génère et télécharge un PDF de l'évaluation
   */
  async generateEvaluationPDF(evaluationData: EvaluationData): Promise<void> {
    try {
      // Créer un nouveau document PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Configuration des couleurs et styles
      const primaryColor = [52, 152, 219]; // Bleu
      const secondaryColor = [149, 165, 166]; // Gris
      const textColor = [44, 62, 80]; // Noir bleuté
      
      let yPosition = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // En-tête du document
      this.addHeader(pdf, evaluationData, yPosition);
      yPosition += 40;

      // Informations du module
      yPosition = this.addModuleInfo(pdf, evaluationData.moduleInfo, yPosition, margin, contentWidth);
      yPosition += 15;

      // Informations de l'étudiant
      yPosition = this.addStudentInfo(pdf, evaluationData, yPosition, margin, contentWidth);
      yPosition += 15;

      // Réponses à l'évaluation
      yPosition = this.addEvaluationResponses(pdf, evaluationData.responses, yPosition, margin, contentWidth);
      yPosition += 10;

      // Note globale et commentaires
      yPosition = this.addOverallRating(pdf, evaluationData, yPosition, margin, contentWidth);

      // Pied de page
      this.addFooter(pdf, evaluationData.submissionTimestamp);

      // Générer le nom du fichier
      const fileName = this.generateFileName(evaluationData);

      // Télécharger le PDF
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
    }
  }

  /**
   * Ajoute l'en-tête du document
   */
  private addHeader(pdf: jsPDF, evaluationData: EvaluationData, yPosition: number): void {
    // Logo/Titre principal
    pdf.setFontSize(24);
    pdf.setTextColor(52, 152, 219);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ÉVALUATION DE MODULE', 105, yPosition, { align: 'center' });

    // Sous-titre
    pdf.setFontSize(12);
    pdf.setTextColor(149, 165, 166);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Rapport d\'évaluation généré automatiquement', 105, yPosition + 8, { align: 'center' });

    // Ligne de séparation
    pdf.setDrawColor(52, 152, 219);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition + 15, 190, yPosition + 15);
  }

  /**
   * Ajoute les informations du module
   */
  private addModuleInfo(pdf: jsPDF, moduleInfo: any, yPosition: number, margin: number, contentWidth: number): number {
    // Titre de section
    pdf.setFontSize(16);
    pdf.setTextColor(52, 152, 219);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS DU MODULE', margin, yPosition);
    yPosition += 10;

    // Cadre pour les informations
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'FD');

    // Contenu des informations
    pdf.setFontSize(11);
    pdf.setTextColor(44, 62, 80);
    pdf.setFont('helvetica', 'normal');

    const leftColumn = margin + 5;
    const rightColumn = margin + (contentWidth / 2) + 5;
    let infoY = yPosition + 8;

    // Colonne gauche
    pdf.setFont('helvetica', 'bold');
    pdf.text('Nom du module:', leftColumn, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(moduleInfo.name, leftColumn, infoY + 5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Code:', leftColumn, infoY + 12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(moduleInfo.code, leftColumn, infoY + 17);

    // Colonne droite
    pdf.setFont('helvetica', 'bold');
    pdf.text('Filière:', rightColumn, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(moduleInfo.filiere, rightColumn, infoY + 5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Crédits ECTS:', rightColumn, infoY + 12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(moduleInfo.credits.toString(), rightColumn, infoY + 17);

    return yPosition + 40;
  }

  /**
   * Ajoute les informations de l'étudiant
   */
  private addStudentInfo(pdf: jsPDF, evaluationData: EvaluationData, yPosition: number, margin: number, contentWidth: number): number {
    // Titre de section
    pdf.setFontSize(16);
    pdf.setTextColor(52, 152, 219);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS DE L\'ÉTUDIANT', margin, yPosition);
    yPosition += 10;

    // Cadre pour les informations
    pdf.setDrawColor(230, 230, 230);
    pdf.setFillColor(248, 249, 250);
    pdf.roundedRect(margin, yPosition, contentWidth, 20, 3, 3, 'FD');

    // Contenu des informations
    pdf.setFontSize(11);
    pdf.setTextColor(44, 62, 80);
    
    const leftColumn = margin + 5;
    const rightColumn = margin + (contentWidth / 2) + 5;
    let infoY = yPosition + 8;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Nom:', leftColumn, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(evaluationData.studentName, leftColumn + 20, infoY);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Date d\'évaluation:', rightColumn, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(evaluationData.evaluationDate.toLocaleDateString('fr-FR'), rightColumn + 35, infoY);

    return yPosition + 25;
  }

  /**
   * Ajoute les réponses à l'évaluation
   */
  private addEvaluationResponses(pdf: jsPDF, responses: any[], yPosition: number, margin: number, contentWidth: number): number {
    // Titre de section
    pdf.setFontSize(16);
    pdf.setTextColor(52, 152, 219);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RÉPONSES À L\'ÉVALUATION', margin, yPosition);
    yPosition += 15;

    responses.forEach((response, index) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Question
      pdf.setFontSize(12);
      pdf.setTextColor(44, 62, 80);
      pdf.setFont('helvetica', 'bold');
      
      const questionText = `${index + 1}. ${response.question}`;
      const questionLines = pdf.splitTextToSize(questionText, contentWidth - 10);
      pdf.text(questionLines, margin + 5, yPosition);
      yPosition += questionLines.length * 5 + 3;

      // Réponse
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(74, 85, 104);

      let responseText = '';
      if (response.type === 'rating') {
        responseText = `Note: ${response.response}/5 ⭐`;
      } else {
        responseText = response.response.toString();
      }

      const responseLines = pdf.splitTextToSize(responseText, contentWidth - 20);
      pdf.text(responseLines, margin + 15, yPosition);
      yPosition += responseLines.length * 4 + 8;
    });

    return yPosition;
  }

  /**
   * Ajoute la note globale et les commentaires
   */
  private addOverallRating(pdf: jsPDF, evaluationData: EvaluationData, yPosition: number, margin: number, contentWidth: number): number {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    // Titre de section
    pdf.setFontSize(16);
    pdf.setTextColor(52, 152, 219);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ÉVALUATION GLOBALE', margin, yPosition);
    yPosition += 15;

    // Cadre pour la note globale
    pdf.setDrawColor(46, 204, 113);
    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'FD');

    // Note globale
    pdf.setFontSize(14);
    pdf.setTextColor(46, 204, 113);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Note globale du module:', margin + 10, yPosition + 10);
    
    pdf.setFontSize(18);
    pdf.text(`${evaluationData.overallRating}/5 ⭐`, margin + 10, yPosition + 20);

    yPosition += 35;

    // Commentaires
    if (evaluationData.comments && evaluationData.comments.trim()) {
      pdf.setFontSize(14);
      pdf.setTextColor(52, 152, 219);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Commentaires additionnels:', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setTextColor(44, 62, 80);
      pdf.setFont('helvetica', 'normal');
      
      const commentLines = pdf.splitTextToSize(evaluationData.comments, contentWidth - 10);
      pdf.text(commentLines, margin + 5, yPosition);
      yPosition += commentLines.length * 5;
    }

    return yPosition;
  }

  /**
   * Ajoute le pied de page
   */
  private addFooter(pdf: jsPDF, submissionTimestamp: Date): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Ligne de séparation
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.3);
    pdf.line(20, pageHeight - 25, 190, pageHeight - 25);

    // Texte du pied de page
    pdf.setFontSize(9);
    pdf.setTextColor(149, 165, 166);
    pdf.setFont('helvetica', 'normal');
    
    const footerText = `Document généré automatiquement le ${submissionTimestamp.toLocaleDateString('fr-FR')} à ${submissionTimestamp.toLocaleTimeString('fr-FR')}`;
    pdf.text(footerText, 105, pageHeight - 15, { align: 'center' });
    
    pdf.text('RateMyCourse - Système d\'évaluation des modules', 105, pageHeight - 10, { align: 'center' });
  }

  /**
   * Génère le nom du fichier PDF
   */
  private generateFileName(evaluationData: EvaluationData): string {
    const date = evaluationData.evaluationDate.toISOString().split('T')[0];
    const moduleName = evaluationData.moduleInfo.name.replace(/[^a-zA-Z0-9]/g, '_');
    const studentName = evaluationData.studentName.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `Evaluation_${moduleName}_${studentName}_${date}.pdf`;
  }

  /**
   * Génère un PDF à partir d'un élément HTML (méthode alternative)
   */
  async generatePDFFromHTML(elementId: string, fileName: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Élément HTML non trouvé');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF depuis HTML:', error);
      throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
    }
  }
}
