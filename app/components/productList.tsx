'use client';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts, addProduct } from '../store/slices/productSlice'
import { Table, Form, Spinner, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

export default function ProductList() {
    const dispatch = useAppDispatch();
    const { items, totalItems, pageSize, loading } = useAppSelector(state => state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10); // State to manage items per page
    const [searchQuery, setSearchQuery] = useState(''); // State to manage search query
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('ASC');

    // Define your state variables for the modal
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, quantity: 0 });

    useEffect(() => {
        dispatch(fetchProducts({ page: currentPage, limit: productsPerPage, search: searchQuery, sortBy: sortBy, sortOrder: sortOrder }))
    }, [dispatch])

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProductsPerPage(Number(e.target.value));
        dispatch(fetchProducts({ page: 1, limit: Number(e.target.value), search: searchQuery, sortBy: sortBy, sortOrder: sortOrder }))
        setCurrentPage(1); // Reset to the first page when changing the items per page
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        dispatch(fetchProducts({ page: 1, limit: productsPerPage, search: e.target.value, sortBy: sortBy, sortOrder: 'asc' }))
        setCurrentPage(1); // Reset to the first page when changing the search query
    };

    const handleSort = (column: string) => {
        if (column === sortBy) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(column);
            setSortOrder('ASC');
        }
        dispatch(fetchProducts({ page: 1, limit: productsPerPage, search: searchQuery, sortBy: column, sortOrder: sortOrder === 'ASC' ? 'DESC' : 'ASC' }))
        setCurrentPage(1);
    };

    const sortIcon = (columnName: string) => {
        if (sortBy === columnName) {
            return sortOrder === 'ASC' ? <FontAwesomeIcon icon={faSort} /> : <FontAwesomeIcon icon={faSort} />;
        }
        return null;
    };

    // Function to handle form input changes
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Function to handle form submission for adding a new product
    const handleAddProduct = () => {
        // dispatch(/* action to add newProduct */);
        // Reset modal state and close modal
        setNewProduct({ name: '', description: '', price: 0, quantity: 0 });
        dispatch(addProduct(newProduct));
        setShowModal(false);
    };

    const handleShowModal = () => {
        setNewProduct({ name: '', description: '', price: 0, quantity: 0 });
        setShowModal(true);
    };

    return (
        <>
            <Container className="mt-3">
                <h1>Product List</h1>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <div className="text-end">
                            <button className="btn btn-primary" onClick={handleShowModal}>Add Product</button>
                        </div>
                    </Col>
                </Row>
                {loading ? (
                    <div className="text-center mt-3">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>
                                        ID {sortIcon('id')}
                                    </th>
                                    <th onClick={() => handleSort('name')}>
                                        Name {sortIcon('name')}
                                    </th>
                                    <th onClick={() => handleSort('description')}>
                                        Description {sortIcon('description')}
                                    </th>
                                    <th onClick={() => handleSort('price')}>
                                        Price {sortIcon('price')}
                                    </th>
                                    <th onClick={() => handleSort('quantity')}>
                                        Quantity {sortIcon('quantity')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    if (items.length == 0) {
                                        return (
                                            <tr>
                                                <td colSpan={5} className="text-center">No products found</td>
                                            </tr>
                                        )
                                    } else {
                                        return (
                                            items.map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.quantity}</td>
                                                </tr>
                                            ))
                                        )
                                    }
                                })()}
                            </tbody>
                        </Table>
                        <Row>
                            <Col className='col-md-2'>
                                {(() => {
                                    if (items.length > 0) {
                                        return (
                                            <Form.Select onChange={handlePageSizeChange} value={pageSize} className="mb-3">
                                                <option value={5}>5 per page</option>
                                                <option value={10}>10 per page</option>
                                                <option value={15}>15 per page</option>
                                                <option value={20}>20 per page</option>
                                            </Form.Select>
                                        )
                                    }
                                })()}
                            </Col>
                            <Col><PaginationControl
                                page={currentPage}
                                between={3}
                                total={totalItems}
                                limit={pageSize}
                                changePage={(page) => {
                                    setCurrentPage(page);
                                    dispatch(fetchProducts({ page: page, limit: productsPerPage, search: searchQuery, sortBy: sortBy, sortOrder: sortOrder }));
                                }}
                                ellipsis={1}
                                next={true}
                                last={true}
                            /></Col>
                        </Row>
                    </>
                )}
            </  Container>

            {/* Bootstrap modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form inside the modal */}
                    <Form>
                        <Form.Group controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={newProduct.name} onChange={handleInputChange}  autoComplete='off' placeholder='ระบุ'/>
                        </Form.Group>
                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={newProduct.description} onChange={handleInputChange} autoComplete='off' placeholder='ระบุ' />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={newProduct.price} onChange={handleInputChange} autoComplete='off' placeholder='ระบุ' />
                        </Form.Group>
                        <Form.Group controlId="productQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" name="quantity" value={newProduct.quantity} onChange={handleInputChange} autoComplete='off' placeholder='ระบุ' />
                        </Form.Group>
                        {/* Other form inputs for description, price, quantity */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddProduct}>
                        {(!loading) ? 'Add Product' : 'Adding...' }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}
