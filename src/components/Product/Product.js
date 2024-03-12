import React from "react";
import "./style.scss";

const Product = ({ product }) => {
    return (
        <div className='product'>
            <h2 className='product__name'>{product.product}</h2>
            <p className='product__price'>Цена: {product.price}</p>
            {product.brand && <p className='product__brand'>Бренд: {product.brand}</p>}
            <span className='product__id'>id: {product.id}</span>
        </div>
    );
};

export default Product;
