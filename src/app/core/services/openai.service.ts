import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  getClothingRecommendation(temperature: number, condition: string, city: string): Observable<string> {
    const prompt = `Given the current weather in ${city} with a temperature of ${temperature}°C and conditions described as ${condition}, suggest appropriate clothing recommendations.`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that provides clothing recommendations based on weather conditions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response.choices[0].message.content.trim()),
      catchError(error => {
        console.error('OpenAI API error:', error);
        return throwError(() => new Error('Failed to fetch clothing recommendation.'));
      })
    );
  }
}
