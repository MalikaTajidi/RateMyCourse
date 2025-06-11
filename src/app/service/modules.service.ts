import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModuleAPI {
  moduleId: number;
  moduleName: string;
  filiere: string;
}

export interface Module {
  id: number;
  name: string;
  status: string;
  description: string;
  filiere: string;
  credits: number;
  evaluated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private baseUrl = 'http://localhost:7000/api-gateway/formations';

  constructor(private http: HttpClient) {}

  getModulesByNiveau(niveauId: number): Observable<ModuleAPI[]> {
    return this.http.get<ModuleAPI[]>(`${this.baseUrl}/niveau/${niveauId}/modules`);
  }

  // Méthode pour transformer les données de l'API en format du frontend
  transformApiModule(apiModule: ModuleAPI): Module {
    return {
      id: apiModule.moduleId,
      name: apiModule.moduleName,
      status: 'Non commencé', // Statut par défaut, à adapter selon votre logique
      description: `Module de ${apiModule.moduleName} pour la filière ${apiModule.filiere}`,
      filiere: apiModule.filiere,
      credits: 3, // Valeur par défaut, à adapter selon votre logique
      evaluated: false
    };
  }
}