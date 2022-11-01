import { Injectable } from '@angular/core';
import { IPsiContract } from 'src/app/model';
import { jsonGuidReviver, isPsiContract } from 'src/app/model/utils';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  constructor() { }

  exportModelAsJson(psiContract: IPsiContract): string {
    return JSON.stringify(psiContract);
  }

  importModelFromJson(jsonString: string): IPsiContract {

    let content = JSON.parse(jsonString, jsonGuidReviver);

    if (content && isPsiContract(content)
    ) {
      return content;
    }
    else {
      throw new Error("File parsing error: not able to parse correct object from JSON");
    }
  }
}
