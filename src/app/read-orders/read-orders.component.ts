import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, Validators, FormArray,
  AbstractControl, ValidationErrors, FormControl, FormGroup,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrderService } from '../services/order-services';
import { Order } from '../models/order-model';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { ExamService } from '../services/exam-service';

function noFutureDate(c: AbstractControl): ValidationErrors | null {
  const d = new Date(c.value); const t = new Date();
  t.setHours(0, 0, 0, 0); d.setHours(0, 0, 0, 0);
  return d > t ? { futureDate: true } : null;
}
const minLengthArray = (m: number) =>
  (c: AbstractControl): ValidationErrors | null =>
    (c as FormArray).length >= m ? null : { minArray: { requiredLength: m } };

@Component({
  selector: 'app-read-orders',
  templateUrl: './read-orders.component.html',
  styleUrls: ['./read-orders.component.css'],
})
export class ReadOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  editing = false;
  errorMsg = '';

  orderForm: FormGroup = this.fb.group({
    id: [0],
    patientId: [0, Validators.required],              
    fechaOrden: ['', [Validators.required, noFutureDate]],
    patient: this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      documentTypeId: [0, Validators.required],
      genderId: [0, Validators.required],
    }),
    exams: this.fb.array([], [minLengthArray(1)]),
  });
  patients: any;

  constructor(private orderService: OrderService, private fb: FormBuilder, private patientService: PatientService,
    private examService:ExamService
  ) {}

  get exams(): FormArray { return this.orderForm.get('exams') as FormArray; }
  getExamControl(i: number): FormControl { return this.exams.at(i) as FormControl; }


  ngOnInit(): void { this.loadOrders(); }

  private loadOrders(): void {
    this.loading = true;
    this.orderService.getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: d => (this.orders = d),
        error: () => (this.errorMsg = 'Error al cargar las órdenes'),
      });
      this.getAllPatients();
      this.getAllPatients();
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find((p: { id: number; }) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Desconocido';
  }

  getAllPatients(): void {
      this.patientService.getPatients().subscribe((data: Patient[]) => {
        this.patients = data;
      });
    }
    
  save(): void {
    if (this.orderForm.invalid) return;

    const fv = this.orderForm.value;

    const patientId = 1;

    const dto = {
      id: fv.id ?? 0,
      patientId,
      fechaOrden: '2025-06-18T15:59:41.847Z', 
      patient: {
        ...fv.patient,
        id: 1,
        documentTypeId: +fv.patient.documentTypeId,
        genderId: +fv.patient.genderId,
      },
    };
     const nombreEx = this.orderForm.value.exams[0]
      const newExam = {
        id: 0,
        nombre:nombreEx,
        descripcion: ''
      };
      this.examService.create(newExam).subscribe((data) => {
        console.log('Examen creado:', data);
      });


    const req$ = this.editing
      ? this.orderService.update(dto.id, dto)
      : this.orderService.create(dto);

    req$.subscribe({
      next: () => { this.resetForm(); this.loadOrders(); },
      error: e => { console.error(e); this.errorMsg = 'Error al guardar la orden'; },
    });
  }

  edit(o: Order): void {
    this.orderForm.patchValue({
      id: o.id,
      patientId: o.patientId,
      fechaOrden: o.fechaOrden.slice(0, 10),    
      patient: {
        id: o.patient?.id ?? o.patientId,
        firstName: o.patient?.firstName ?? '',
        lastName: o.patient?.lastName ?? '',
        documentNumber: o.patient?.documentNumber ?? '',
        documentTypeId: o.patient?.documentTypeId ?? 0,
        genderId: o.patient?.genderId ?? 0,
      },
    });
    this.exams.clear();
    this.editing = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(id: number): void {
    if (!confirm('¿Eliminar la orden definitivamente?')) return;
    this.orderService.delete(id).subscribe({
      next: () => { this.orders = this.orders.filter(o => o.id !== id); if (this.orderForm.value.id === id) this.resetForm(); },
      error: () => (this.errorMsg = 'Error al eliminar la orden'),
    });
  }
  cancel(): void { this.resetForm(); }
  addExam(): void { this.exams.push(this.fb.control('', Validators.required)); }
  removeExam(i: number): void { this.exams.removeAt(i); }
  private resetForm(): void { this.orderForm.reset(); this.exams.clear(); this.editing = false; }
}
