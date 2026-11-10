import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from './user.model';
import { UserService } from './user.service';

// Componente con el CRUD completo de usuarios
@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule],
  templateUrl: './user.html',
})
export class UserComponent implements OnInit {
  // Inyección de dependencias
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  // Estado con signals
  users = signal<User[]>([]);
  loading = signal(true);
  saving = signal(false);
  editingUser = signal<User | null>(null);
  message = signal<{ type: 'ok' | 'error'; text: string } | null>(null);
  query = signal('');

  // Estado derivado con computed()
  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.users().filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  });

  stats = computed(() => {
    const users = this.users();
    const latest = users.reduce<User | null>(
      (acc, u) => (!acc || new Date(u.created_at!) > new Date(acc.created_at!) ? u : acc),
      null,
    );
    return {
      total: users.length,
      domains: new Set(users.map((u) => u.email.split('@')[1])).size,
      latest,
    };
  });

  // Formulario reactivo con validaciones
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  // Leer
  loadUsers(): void {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => {
        this.showError(err, 'No se pudieron cargar los usuarios: ');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  // Crear / Actualizar
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    const editing = this.editingUser();
    const request$ = editing
      ? this.userService.updateUser(editing.id, data)
      : this.userService.createUser(data);

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.message.set({ type: 'ok', text: editing ? 'Usuario actualizado' : 'Usuario creado' });
        this.cancelEdit();
        this.saving.set(false);
        this.loadUsers();
      },
      error: (err) => {
        this.showError(err);
        this.saving.set(false);
      },
    });
  }

  edit(user: User): void {
    this.editingUser.set(user);
    this.form.setValue({ name: user.name, email: user.email });
  }

  cancelEdit(): void {
    this.editingUser.set(null);
    this.form.reset();
  }

  // Eliminar
  remove(user: User): void {
    if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        if (this.editingUser()?.id === user.id) this.cancelEdit();
        this.message.set({ type: 'ok', text: `${user.name} fue eliminado` });
        this.loadUsers();
      },
      error: (err) => this.showError(err),
    });
  }

  initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  }

  formatDate(iso?: string): string {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
  }

  private showError(err: HttpErrorResponse, prefix = ''): void {
    const text =
      err.error?.message ?? (err.status === 0 ? 'No hay conexión con el backend (puerto 3001)' : err.message);
    this.message.set({ type: 'error', text: prefix + text });
  }
}
