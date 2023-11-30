'use client';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts } from '../store/slices/productSlice'
import { Table, Form, Spinner, Container, Row, Col } from 'react-bootstrap';
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
                            <button className="btn btn-primary">Add Product</button>
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
        </>

    )
}
