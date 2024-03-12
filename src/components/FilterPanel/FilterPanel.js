import React, { useEffect, useState } from "react";
import ProductsList from "../ProductsList/ProductsList";
import { useQuery } from "react-query";
import { fetchData } from "../../server/api";
import { removeDuplicates } from "../../utils/removeDuplicates";
import { brandOptions } from "../../utils/brandOptions";
import "./style.scss";

const FilterPanel = () => {
    const [products, setProducts] = useState([]);
    const [searchingValue, setSearchingValue] = useState('');
    const [isBrandLoading, setIsBrandLoading] = useState(false);
    const [page, setPage] = useState(0);
    const pageSize = 55; //больше на случай, если будет много дубликатов
    const {data, isLoading, isError, refetch } = useQuery(['result', page], ()=> fetchData({
            action: "get_ids",
            params: { offset: page, limit: pageSize }},
            { keepPreviousData: true, refetchOnWindowFocus: false}));


    useEffect(() => {
       if (data) {
           setProducts(removeDuplicates(data));
       }
    }, [data]);

    const handleBrandChange = (e) => {
        const selectedValue = e.target.value

        if (selectedValue) {
            setIsBrandLoading(true)

            fetchData({
                action: "filter",
                params: { brand: e.target.value, limit: pageSize }
            }).then((data) => {
                setProducts(removeDuplicates(data))
                setIsBrandLoading(false)
            }).catch((error) => {
                console.error("Ошибка при запросе:", error);
                setIsBrandLoading(false)
            });
        }
    };

    const goToPage = (newPage) => {
        setPage(newPage);
        setSearchingValue('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchingValue) {
            return;
        }

        const searchingValueLower = searchingValue.toLowerCase();

        const searchProducts = products.filter(product => {
            const productLowerCase = product.product.toLowerCase();
            const brandLowerCase = product.brand ? product.brand.toLowerCase() : '';
            const priceString = product.price ? product.price.toString() : '';

            const productMatch = productLowerCase.includes(searchingValueLower);
            const brandMatch = brandLowerCase.includes(searchingValueLower);
            const priceMatch = priceString.includes(searchingValueLower);

            return productMatch || brandMatch || priceMatch;
        });

        setProducts(searchProducts);
    };

    const renderContent = () => {
        if (isLoading) {
            return <h1 className='info'>Идет загрузка...</h1>;
        }

        if (isError) {
            return (
                <div className='box'>
                    <h1 className='info'>Ошибка</h1>
                    <button className='info__btn' onClick={refetch}>Повторить попытку</button>
                </div>
            );
        }

        if (!data || products.length === 0) {
            return <h1 className='info'>Нет данных</h1>;
        }

        return isBrandLoading ? (
            <h1 className='info'>Идет загрузка...</h1>
        ) : (
            <ProductsList filteredProducts={products} />
        );
    };

    return (
        <div className='panel'>
            <div className='panel__control'>
                <div className='panel__filter'>
                    <select
                        className='panel__filter__select'
                        name="brands"
                        id="brands"
                        onChange={handleBrandChange}
                    >
                        <option value="">Выберете бренд</option>
                        { brandOptions.map(item =>
                            <option key={item} value={item}>{item}</option>
                        )}
                    </select>
                    <form onSubmit={handleSearch}>
                        <input
                            className='panel__filter__input'
                            type="text"
                            placeholder='Поиск по названию, цене, бренду'
                            value={searchingValue}
                            onChange={(e) => setSearchingValue(e.target.value)}
                        />
                        <button type="submit" className='panel__btn'>Искать</button>
                    </form>
                </div>
                <div className='panel__btns'>
                    <button
                        className={`panel__btn ${page === 0 ? 'disabled' : ''}`}
                        onClick={() => goToPage(page - 50)}
                        disabled={page === 0}
                    >
                        prev
                    </button>
                    <button
                        className={`panel__btn ${!products.length ? 'disabled' : ''}`}
                        onClick={() => goToPage(page + 50)}
                        disabled={!products.length}
                    >
                        next
                    </button>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default FilterPanel;
