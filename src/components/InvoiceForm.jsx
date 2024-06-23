import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInvoice, updateInvoice } from '../redux/invoicesSlice';
import { selectProducts } from '../redux/productsSlice';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import ProductsTab from './ProductsTab';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import generateRandomId from '../utils/generateRandomId';
import { convertCurrency } from '../utils/currencyConversion';
import { useInvoiceListData } from '../redux/hooks';

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCopy = location.pathname.includes('create');
  const isEdit = location.pathname.includes('edit');
  const products = useSelector(selectProducts);

  const [isOpen, setIsOpen] = useState(false);
  const [copyId, setCopyId] = useState('');
  const { getOneInvoice, listSize } = useInvoiceListData();

  const [formData, setFormData] = useState(
    isEdit
      ? getOneInvoice(params.id)
      : isCopy && params.id
      ? {
          ...getOneInvoice(params.id),
          id: generateRandomId(),
          invoiceNumber: listSize + 1,
        }
      : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: listSize + 1,
          dateOfIssue: '',
          billTo: '',
          billToEmail: '',
          billToAddress: '',
          billFrom: '',
          billFromEmail: '',
          billFromAddress: '',
          notes: '',
          total: '0.00',
          subTotal: '0.00',
          taxRate: '',
          taxAmount: '0.00',
          discountRate: '',
          discountAmount: '0.00',
          currency: 'USD',
          items: [],
        }
  );

  useEffect(() => {
    handleCalculateTotal();
  }, [formData.items]);

  const handleRowDel = (itemToDelete) => {
    const updatedItems = formData.items.filter(item => item.itemId !== itemToDelete.itemId);
    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      itemId: id,
      itemName: '',
      itemDescription: '',
      itemPrice: '1.00',
      itemQuantity: 1,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
    handleCalculateTotal();
  };

  const handleCalculateTotal = () => {
    setFormData((prevFormData) => {
      let subTotal = 0;

      prevFormData.items.forEach(item => {
        subTotal += parseFloat(item.itemPrice) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(subTotal * (prevFormData.taxRate / 100)).toFixed(2);
      const discountAmount = parseFloat(subTotal * (prevFormData.discountRate / 100)).toFixed(2);
      const total = (subTotal - parseFloat(discountAmount) + parseFloat(taxAmount)).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const onItemizedItemEdit = (evt, id) => {
    const updatedItems = formData.items.map(oldItem => {
      if (oldItem.itemId === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value };
      }
      return oldItem;
    });

    setFormData({ ...formData, items: updatedItems });
    handleCalculateTotal();
  };

  const editField = (name, value) => {
    setFormData({ ...formData, [name]: value });
    handleCalculateTotal();
  };

  const handleCurrencyChange = async (selectedCurrency) => {
    const updatedItems = await Promise.all(
      formData.items.map(async item => {
        const convertedPrice = await convertCurrency(item.itemPrice, formData.currency, selectedCurrency);
        return { ...item, itemPrice: convertedPrice };
      })
    );
    setFormData({ ...formData, currency: selectedCurrency, items: updatedItems });
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddInvoice = async () => {
    try {
      if (isEdit) {
        await dispatch(updateInvoice({ id: params.id, updatedInvoice: formData }));
        alert('Invoice updated successfully 🥳');
      } else if (isCopy) {
        await dispatch(addInvoice({ id: generateRandomId(), ...formData }));
        alert('Invoice added successfully 🥳');
      } else {
        await dispatch(addInvoice(formData));
        alert('Invoice added successfully 🥳');
      }
      navigate('/');
    } catch (error) {
      console.error('Error adding invoice:', error);
      alert('An error occurred while adding the invoice. Please try again.');
    }
  };

  return (
    <Form onSubmit={openModal}>
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>

      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <ProductsTab />
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={formData.currency}
              items={formData.items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>{formData.currency}{formData.subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small">({formData.discountRate || 0}%)</span>
                    {formData.currency}{formData.discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small">({formData.taxRate || 0}%)</span>
                    {formData.currency}{formData.taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: '1.125rem' }}>
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">{formData.currency}{formData.total || 0}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={formData.notes}
              onChange={(e) => editField(e.target.name, e.target.value)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="dark" onClick={handleAddInvoice} className="d-block w-100 mb-2">
              {isEdit ? 'Update Invoice' : 'Add Invoice'}
            </Button>
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                isOpen,
                id: formData.id,
                currency: formData.currency,
                currentDate: formData.currentDate,
                invoiceNumber: formData.invoiceNumber,
                dateOfIssue: formData.dateOfIssue,
                billTo: formData.billTo,
                billToEmail: formData.billToEmail,
                billToAddress: formData.billToAddress,
                billFrom: formData.billFrom,
                billFromEmail: formData.billFromEmail,
                billFromAddress: formData.billFromAddress,
                notes: formData.notes,
                total: formData.total,
                subTotal: formData.subTotal,
                taxRate: formData.taxRate,
                taxAmount: formData.taxAmount,
                discountRate: formData.discountRate,
                discountAmount: formData.discountAmount,
              }}
              items={formData.items}
              currency={formData.currency}
              subTotal={formData.subTotal}
              taxAmount={formData.taxAmount}
              discountAmount={formData.discountAmount}
              total={formData.total}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) => handleCurrencyChange(event.target.value)}
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="USD">USD (United States Dollar)</option>
                <option value="INR">INR (Indian Rupee)</option>
                <option value="GBP">GBP (British Pound Sterling)</option>
                <option value="JPY">JPY (Japanese Yen)</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
