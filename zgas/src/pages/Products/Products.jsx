import React from 'react';
import './Products.css';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Crud, DataSourceCache } from '@toolpad/core/Crud';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { Button, Box } from '@mui/material';

const API = "http://localhost:4000/api/products";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
});

const productsDataSource = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Nombre', flex: 1 },
    { field: 'text', headerName: 'Descripción', flex: 1 },
    { field: 'price', headerName: 'Precio', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
  ],

  getMany: async ({ paginationModel }) => {
    const response = await fetch(API);
    const data = await response.json();

    const start = paginationModel?.page * paginationModel?.pageSize || 0;
    const end = start + (paginationModel?.pageSize || data.length);

    return {
      items: data.slice(start, end),
      itemCount: data.length,
    };
  },

  getOne: async (id) => {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok) throw new Error("Producto no encontrado");
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
    if (!response.ok) throw new Error("Error al crear el producto");
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
    if (!response.ok) throw new Error("Error al actualizar el producto");
    return await response.json();
  },

  deleteOne: async (id) => {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el producto");
  },

  validate: (formValues) => {
    let issues = [];

    if (!formValues.title) {
      issues.push({ message: "El nombre es obligatorio", path: ["title"] });
    }

    if (!formValues.text) {
      issues.push({ message: "La descripción es obligatoria", path: ["text"] });
    }

    if (!formValues.price || isNaN(formValues.price)) {
      issues.push({ message: "El precio debe ser un número válido", path: ["price"] });
    }

    if (!formValues.stock || isNaN(formValues.stock)) {
      issues.push({ message: "El stock debe ser un número válido", path: ["stock"] });
    }

    return { issues };
  },
};

const productsCache = new DataSourceCache();

export default function Products() {
  const router = useDemoRouter('/products');

  const isCreating = router.pathname === '/products/new';
  const isEditing = /^\/products\/\d+\/edit$/.test(router.pathname);

  return (
    <DemoProvider>
      <AppProvider theme={demoTheme} router={router}>
        <DashboardLayout>
          <PageContainer title="Tabla de Productos">
            {(isCreating || isEditing) && (
              <Box mb={2}>
                <Button variant="outlined" color="secondary" onClick={() => router.navigate('/products')}>
                  Cancelar
                </Button>
              </Box>
            )}
            <Crud
              dataSource={productsDataSource}
              dataSourceCache={productsCache}
              rootPath="/products"
              initialPageSize={5}
              defaultValues={{ title: '', text: '', price: '', stock: '' }}
            />
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
