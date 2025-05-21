import React, { useState, useEffect } from 'react';  
import './Customers.css';  
import { createTheme } from '@mui/material/styles';  
import { AppProvider } from '@toolpad/core/AppProvider';  
import { DashboardLayout } from '@toolpad/core/DashboardLayout';  
import { PageContainer } from '@toolpad/core/PageContainer';  
import { Crud, DataSourceCache } from '@toolpad/core/Crud';  
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';  
import { Button, Box } from '@mui/material';  

const API = "http://localhost:4000/api/customers";  

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
});

const customersDataSource = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'lastName', headerName: 'Apellido', flex: 1 },
    { field: 'birthday', headerName: 'Fecha de Nacimiento', flex: 1 },
    { field: 'email', headerName: 'Correo Electrónico', flex: 1 },
    { field: 'telephone', headerName: 'Teléfono', flex: 1 },
    { field: 'dui', headerName: 'DUI', flex: 1 },
  ],

  getMany: async ({ paginationModel }) => {
    const response = await fetch(API);
    const data = await response.json();
    console.log("Datos recibidos de la API:", data);

    const items = data.map(customer => {
      return {
        id: customer._id,
        name: customer.name || '',
        lastName: customer.lastName || '',
        birthday: customer.birthday || '',
        email: customer.email || '',
        telephone: customer.telephone || '',
        dui: customer.dui || '',
      };
    });

    console.log("Clientes transformados:", items);

    const start = paginationModel?.page * paginationModel?.pageSize || 0;
    const end = start + (paginationModel?.pageSize || items.length);

    return {
      items: items.slice(start, end),
      itemCount: items.length,
    };
  },

  getOne: async (id) => {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) throw new Error("Cliente no encontrado");
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
    if (!response.ok) throw new Error("Error al crear el cliente");
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
    if (!response.ok) throw new Error("Error al actualizar el cliente");
    return await response.json();
  },

  deleteOne: async (id) => {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el cliente");
  },

  validate: (formValues) => {
    let issues = [];

    if (!formValues.name) {
      issues.push({ message: "El nombre es obligatorio", path: ["name"] });
    }

    if (!formValues.lastName) {
      issues.push({ message: "El apellido es obligatorio", path: ["lastName"] });
    }

    if (!formValues.birthday || isNaN(formValues.birthday)) {
      issues.push({ message: "La fecha de nacimiento debe ser un número válido", path: ["birthday"] });
    }

    if (!formValues.telephone || isNaN(formValues.telephone)) {
      issues.push({ message: "El teléfono debe ser un número válido", path: ["telephone"] });
    }

    if (!formValues.dui) {
      issues.push({ message: "El DUI es obligatorio", path: ["dui"] });
    }

    return { issues };
  },
};

const customersCache = new DataSourceCache();

export default function Customers() {
  const router = useDemoRouter('/customers');
  const [customer, setCustomer] = useState(null); 

  const isCreating = router.pathname === '/customers/new';
  const isEditing = /^\/customers\/[^/]+\/edit$/.test(router.pathname);
  const match = router.pathname.match(/\/customers\/([^/]+)\/edit/);
  
  const customerId = match ? match[1] : null;

  useEffect(() => {
    if (isEditing && customerId) {
      customersDataSource.getOne(customerId)
        .then(customerData => {
          console.log('Cliente para editar:', customerData);
          setCustomer(customerData); 
        })
        .catch(error => {
          console.error('Error al obtener el cliente:', error);
        });
    }
  }, [isEditing, customerId]);

  useEffect(() => {
    if (isCreating) {
      setCustomer(null); 
    }
  }, [isCreating]);

  return (
    <DemoProvider>
      <AppProvider theme={demoTheme} router={router}>
        <DashboardLayout>
          <PageContainer title="Tabla de Clientes">
            {(isCreating || isEditing) && (
              <Box mb={2}>
                <Button variant="outlined" color="secondary" onClick={() => router.navigate('/customers')}>
                  Cancelar
                </Button>
              </Box>
            )}
            <Crud
              dataSource={customersDataSource}
              dataSourceCache={customersCache}
              rootPath="/customers"
              initialPageSize={5}
              defaultValues={{
                name: customer ? customer.name : '',
                lastName: customer ? customer.lastName : '',
                birthday: customer ? customer.birthday : '',
                email: customer ? customer.email : '',
                telephone: customer ? customer.telephone : '',
                dui: customer ? customer.dui : '',
              }}  
            />
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
