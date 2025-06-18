import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../models/patient.model';
import { PatientService } from '../services/patient.service';
import { GenderService } from '../services/gender.service';
import { Gender } from '../models/gender.model';
import { DocumentTypeService } from '../services/document-type.service';
import { DocumentTypeModel } from '../models/document-type.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  viewForm = false;
  formPatient!: FormGroup;
  isCreate = false;
  gender: Gender[] = [];
  documentTypes: DocumentTypeModel[] = [];
  searchTerm: any;

  constructor(
    private fb: FormBuilder, 
    private patientService: PatientService,
    private genderService: GenderService,
    private documentTypeService: DocumentTypeService) {}

  ngOnInit(): void {
    this.formPatient = this.fb.group({
      id: [{ value: 0, disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      documentTypeId: [null, Validators.required],
      genderId: [null, Validators.required],
    });
    this.getDocumentType();
    this.getAllGender();
    this.getAllPatients();
  }
  getDocumentType(){
    this.documentTypeService.getAll().subscribe((data:DocumentTypeModel[]) => {
      this.documentTypes = data;
    });
  }

  getDocumentTypeName(id: number): string {
    const type = this.documentTypes.find(t => t.id === id);
    return type ? type.name : '';
  }

  getAllGender(){
    this.genderService.getGenders().subscribe((data: Gender[]) => {
      this.gender = data;
    }); 
  }

  getGenderName(id: number): string {
    const gender = this.gender.find(g => g.id === id);
    return gender ? gender.name : '';
  }

  getAllPatients(): void {
    this.patientService.getPatients().subscribe((data: Patient[]) => {
      this.patients = data;
    });
  }

  delete(id: number): void {
    this.patientService.delete(id).subscribe(() => {
      this.getAllPatients();
    });
  }

  showFormEdit(data?: Patient): void {
    this.viewForm = true;
    this.isCreate = !data;

    this.formPatient.reset();
    if (data) {
      this.formPatient.patchValue(data);
    }
  }

  savePatient(): void {
  if (this.formPatient.invalid) {
    this.formPatient.markAllAsTouched(); 
    return;
  }

  const rawForm = this.formPatient.getRawValue();

  const patient: Patient = {
    ...rawForm,
    id: this.formPatient.get('id')?.value || 0     
  };

  if (this.isCreate) {
    this.patientService.create(patient).subscribe(() => {
      this.getAllPatients();
      this.viewForm = false;
    });
  } else {
    this.patientService.update(patient).subscribe(() => {
      this.getAllPatients();
      this.viewForm = false;
    });
  }
}

  searchPatients(): void {
    if (!this.searchTerm.trim()) {
      this.getAllPatients();
      return;
    }

    this.patientService.search(this.searchTerm).subscribe((data) => {
      this.patients = data;
    });
  }

}
