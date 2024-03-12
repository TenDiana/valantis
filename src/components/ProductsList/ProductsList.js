import React from "react";
import  Product  from "../Product/Product";
import "./style.scss";

const ProductsList = ({ filteredProducts }) => {
    return (
        <div className='container'>
            {
                filteredProducts.map(item => <Product key={item.id} product={item}/>)
            }
        </div>
    );
};

export default ProductsList;
