import React, { useState } from "react";
import { UsersApi } from "../api/users";
import AppLayout from "../components/app/AppLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Completá todos los campos");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      await UsersApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMessage("Contraseña actualizada correctamente");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Cambiar contraseña</h1>
          <p className="text-sm text-gray-500 mb-6">
            Actualizá la contraseña de tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Contraseña actual</label>
              <Input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Ingresá tu contraseña actual"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Nueva contraseña</label>
              <Input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Ingresá la nueva contraseña"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirmar nueva contraseña</label>
              <Input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repetí la nueva contraseña"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-green-600">
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}