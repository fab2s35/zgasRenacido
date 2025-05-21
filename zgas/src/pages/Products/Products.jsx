import React, { useState, useEffect } from 'react';
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
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'description', headerName: 'Descripción', flex: 1 },
    { field: 'price', headerName: 'Precio', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
  ],

  getMany: async ({ paginationModel }) => {
    const response = await fetch(API);
    const data = await response.json();
    console.log("Datos recibidos de la API:", data);

    const items = data.map(product => {
      return {
        id: product._id,
        name: product.name || '', 
        description: product.description || '',  
        price: product.price || 0,
        stock: product.stock || 0,
      };
    });

    console.log("Productos transformados:", items);

    const start = paginationModel?.page * paginationModel?.pageSize || 0;
    const end = start + (paginationModel?.pageSize || items.length);

    return {
      items: items.slice(start, end),
      itemCount: items.length,
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

    if (!formValues.name) {
      issues.push({ message: "El nombre es obligatorio", path: ["name"] });
    }

    if (!formValues.description) {
      issues.push({ message: "La descripción es obligatoria", path: ["description"] });
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
  const [product, setProduct] = useState(null); 

  const isCreating = router.pathname === '/products/new';
  const isEditing = /^\/products\/\d+\/edit$/.test(router.pathname);


  const match = router.pathname.match(/\/products\/(\d+)\/edit/);
  const productId = match ? match[1] : null;

  useEffect(() => {
    if (isEditing && productId) {

      productsDataSource.getOne(productId)
        .then(productData => {
          console.log('Producto para editar:', productData);
          setProduct(productData); 
        })
        .catch(error => {
          console.error('Error al obtener el producto:', error);
        });
    }
  }, [isEditing, productId]);

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
              defaultValues={{
                name: product ? product.name : '', 
                description: product ? product.description : '', 
                price: product ? product.price : '', 
                stock: product ? product.stock : ''
              }} 
            />
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
