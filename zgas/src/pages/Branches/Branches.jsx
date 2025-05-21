import React, { useState, useEffect } from 'react';  
import './Branches.css';  
import { createTheme } from '@mui/material/styles';  
import { AppProvider } from '@toolpad/core/AppProvider';  
import { DashboardLayout } from '@toolpad/core/DashboardLayout';  
import { PageContainer } from '@toolpad/core/PageContainer';  
import { Crud, DataSourceCache } from '@toolpad/core/Crud';  
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';  
import { Button, Box } from '@mui/material';  

const API = "http://localhost:4000/api/branches";  

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
});

const branchesDataSource = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'address', headerName: 'Dirección', flex: 1 },
    { field: 'birthday', headerName: 'Fecha de Creación', flex: 1 },
    { field: 'schedule', headerName: 'Horario', flex: 1 },
    { field: 'telephone', headerName: 'Teléfono', flex: 1 },
  ],

  getMany: async ({ paginationModel }) => {
    const response = await fetch(API);
    const data = await response.json();
    console.log("Datos recibidos de la API:", data);

    const items = data.map(branch => {
      return {
        id: branch._id,
        name: branch.name || '',
        address: branch.address || '',
        birthday: branch.birthday || '',
        schedule: branch.schedule || '',
        telephone: branch.telephone || '',
      };
    });

    console.log("Sucursales transformadas:", items);

    const start = paginationModel?.page * paginationModel?.pageSize || 0;
    const end = start + (paginationModel?.pageSize || items.length);

    return {
      items: items.slice(start, end),
      itemCount: items.length,
    };
  },

  getOne: async (id) => {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) throw new Error("Sucursal no encontrada");
    return await response.json();
  },

  createOne: async (data) => {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear la sucursal");
    return await response.json();
  },

  updateOne: async (id, data) => {
    const response = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar la sucursal");
    return await response.json();
  },

  deleteOne: async (id) => {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la sucursal");
  },

  validate: (formValues) => {
    let issues = [];

    // Validación de nombre
    if (!formValues.name) {
      issues.push({ message: "El nombre es obligatorio", path: ["name"] });
    }

    // Validación de dirección
    if (!formValues.address) {
      issues.push({ message: "La dirección es obligatoria", path: ["address"] });
    }

    // Validación de fecha de creación (birthday)
    if (!formValues.birthday) {
      issues.push({ message: "La fecha de creación es obligatoria", path: ["birthday"] });
    } else {
      const birthdayDate = new Date(formValues.birthday);
      if (isNaN(birthdayDate)) {
        issues.push({ message: "La fecha de creación no es válida", path: ["birthday"] });
      }
    }

    // Validación de horario
    if (!formValues.schedule) {
      issues.push({ message: "El horario es obligatorio", path: ["schedule"] });
    }

    // Validación de teléfono
    if (!formValues.telephone || isNaN(formValues.telephone)) {
      issues.push({ message: "El teléfono debe ser un número válido", path: ["telephone"] });
    }

    return { issues };
  },
};

const branchesCache = new DataSourceCache();

export default function Branches() {
  const router = useDemoRouter('/branches');
  const [branch, setBranch] = useState(null);  // Para guardar los datos de la sucursal

  const isCreating = router.pathname === '/branches/new';
  const isEditing = /^\/branches\/\d+\/edit$/.test(router.pathname);

  // Extraer ID de la sucursal de la URL para la edición
  const match = router.pathname.match(/\/branches\/(\d+)\/edit/);
  const branchId = match ? match[1] : null;

  useEffect(() => {
    if (isEditing && branchId) {
      // Llamamos a la API para obtener la sucursal con el ID
      branchesDataSource.getOne(branchId)
        .then(branchData => {
          console.log('Sucursal para editar:', branchData);
          setBranch(branchData); // Guardamos la sucursal en el estado
        })
        .catch(error => {
          console.error('Error al obtener la sucursal:', error);
        });
    }
  }, [isEditing, branchId]);

  return (
    <DemoProvider>
      <AppProvider theme={demoTheme} router={router}>
        <DashboardLayout>
          <PageContainer title="Tabla de Sucursales">
            {(isCreating || isEditing) && (
              <Box mb={2}>
                <Button variant="outlined" color="secondary" onClick={() => router.navigate('/branches')}>
                  Cancelar
                </Button>
              </Box>
            )}
            <Crud
              dataSource={branchesDataSource}
              dataSourceCache={branchesCache}
              rootPath="/branches"
              initialPageSize={5}
              defaultValues={{
                name: branch ? branch.name : '',
                address: branch ? branch.address : '',
                birthday: branch ? branch.birthday : '',
                schedule: branch ? branch.schedule : '',
                telephone: branch ? branch.telephone : ''
              }}  // Usar el estado para los valores por defecto
            />
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
