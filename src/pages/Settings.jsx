import React, { useEffect, useState } from "react";
import AppLayout from "../components/app/AppLayout";
import { UsersApi } from "../api/users";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";

export default function Settings() {
  const [profile, setProfile] = useState({
    nombre: "",
    apellido: "",
    razonSocial: "",
    cuit: "",
    email: "",
    direccion: "",
    telefono: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [msgProfile, setMsgProfile] = useState("");
  const [errProfile, setErrProfile] = useState("");

  const [msgPassword, setMsgPassword] = useState("");
  const [errPassword, setErrPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await UsersApi.me();

        setProfile({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          razonSocial: data.razonSocial || "",
          cuit: data.cuit || "",
          email: data.email || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
        });
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };

    loadUser();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsgProfile("");
    setErrProfile("");

    try {
      setLoadingProfile(true);

      await UsersApi.updateMe({
        nombre: profile.nombre,
        apellido: profile.apellido,
        razonSocial: profile.razonSocial,
        cuit: profile.cuit,
        direccion: profile.direccion,
        telefono: profile.telefono,
      });

      setMsgProfile("Datos actualizados correctamente");
    } catch (error) {
      console.error(error);
      setErrProfile("No se pudieron actualizar los datos");
    } finally {
      setLoadingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setMsgPassword("");
    setErrPassword("");

    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      setErrPassword("Completá todos los campos");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setErrPassword("Las contraseñas no coinciden");
      return;
    }

    if (password.newPassword.length < 6) {
      setErrPassword("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoadingPassword(true);

      await UsersApi.changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });

      setMsgPassword("Contraseña actualizada correctamente");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      setErrPassword("No se pudo cambiar la contraseña");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Datos personales</TabsTrigger>
            <TabsTrigger value="password">Contraseña</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <form
                onSubmit={saveProfile}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm mb-1">Nombre</label>
                  <Input
                    name="nombre"
                    value={profile.nombre}
                    onChange={handleProfileChange}
                    placeholder="Nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Apellido</label>
                  <Input
                    name="apellido"
                    value={profile.apellido}
                    onChange={handleProfileChange}
                    placeholder="Apellido"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Razón social</label>
                  <Input
                    name="razonSocial"
                    value={profile.razonSocial}
                    onChange={handleProfileChange}
                    placeholder="Razón social"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">CUIT</label>
                  <Input
                    name="cuit"
                    value={profile.cuit}
                    onChange={handleProfileChange}
                    placeholder="CUIT"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Email</label>
                  <Input
                    name="email"
                    value={profile.email}
                    disabled
                    placeholder="Email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Dirección</label>
                  <Input
                    name="direccion"
                    value={profile.direccion}
                    onChange={handleProfileChange}
                    placeholder="Dirección"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Teléfono</label>
                  <Input
                    name="telefono"
                    value={profile.telefono}
                    onChange={handleProfileChange}
                    placeholder="Teléfono"
                  />
                </div>

                {errProfile && (
                  <div className="md:col-span-2 text-sm text-red-600">
                    {errProfile}
                  </div>
                )}

                {msgProfile && (
                  <div className="md:col-span-2 text-sm text-green-600">
                    {msgProfile}
                  </div>
                )}

                <div className="md:col-span-2">
                  <Button type="submit" disabled={loadingProfile}>
                    {loadingProfile ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="p-6">
              <form onSubmit={savePassword} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm mb-1">Contraseña actual</label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Contraseña actual"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Nueva contraseña</label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nueva contraseña"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Confirmar nueva contraseña</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirmar nueva contraseña"
                  />
                </div>

                {errPassword && (
                  <div className="text-sm text-red-600">
                    {errPassword}
                  </div>
                )}

                {msgPassword && (
                  <div className="text-sm text-green-600">
                    {msgPassword}
                  </div>
                )}

                <Button type="submit" disabled={loadingPassword}>
                  {loadingPassword ? "Guardando..." : "Cambiar contraseña"}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}