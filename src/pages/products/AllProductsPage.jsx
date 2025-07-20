import { PilcrowRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import AllProductList from "../../components/Products/AllProductList";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import FilterSidebar from "../../components/sidebar/FilterSideBar";

import { useSelector } from "react-redux";
import { Collapse } from "../../components/collapsible/Collapse";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setFiltered } from "../../features/filters/filterSlice";
import { buildQuery } from "../../utility/buildQuery";

const AllProductsPage = () => {
  const [showFilter, setShowFilter] = useState(true);
  const { products, FilterProduct } = useSelector((state) => state.productInfo);

  const [productList, setProductList] = useState([]);

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const param = new URLSearchParams(searchParams);
   


  // let params = {
  //   mainCategory: [...new Set(searchParams.getAll("mainCategory"))] || [],
  //   maxPrice: searchParams.get("maxPrice") || "",
  //   minPrice: searchParams.get("minPrice") || "",
  //   colors: searchParams.getAll("colors") || [],
  //   sale: searchParams.get("sale") || "",
  //   brand: searchParams.getAll("brand") || [],
  //   productPath: searchParams.get("productPath") || "",
  // };

  // const query = buildQuery(searchParams);

  const { filtered } = useSelector((state) => state.filterInfo);

  const handleOnSortOption = (option) => {
    if (option === "Price:Low-High") {
      setProductList([...productList?.sort((a, b) => a.price - b.price)]);
    }
    if (option === "Price:High-Low") {
      setProductList([...productList?.sort((a, b) => b.price - a.price)]);
    }
    if (option === "Newest") {
      const sortedProducts = productList?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProductList(sortedProducts);
    }
  };
  const maxPrice = Math.max(...products.map((product) => product.price));
  const mainCategory = [...new Set(searchParams.getAll("mainCategory"))] || [];
  const colors = searchParams.getAll("colors") || [];

  const handleOnChecked = (name, value, checked) => {
    // Deep clone (shallow works here because mainCategory is a 1-level array)
    let mainCategory =
      searchParams.get("mainCategory")?.split(",").filter(Boolean) || [];
    let brand = searchParams.get("brand")?.split(",").filter(Boolean) || [];
    let colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    let sale = searchParams.get("sale") || "";

    const newParams = new URLSearchParams(searchParams);

    if (name === "colors") {
      if (checked) {
        if (!colors.includes(value)) {
          colors.push(value);
        }
      } else {
        colors = [...new Set(colors)];

        colors = colors.filter((clr) => clr !== value);
      }

      // Create new search params from scratch

      if (colors.length > 0) {
        newParams.set("colors", colors.join(","));
      } else {
        newParams.delete("colors");
      }
      setSearchParams(newParams);
    }
    if (name === "mainCategory") {
      if (checked) {
        if (!mainCategory.includes(value)) {
          mainCategory.push(value);
        }
      } else {
        mainCategory = [...new Set(mainCategory)];

        mainCategory = mainCategory.filter((category) => category !== value);
      }

      // Create new search params from scratch

      if (mainCategory.length > 0) {
        newParams.set("mainCategory", mainCategory.join(","));
      } else {
        newParams.delete("mainCategory");
      }
      setSearchParams(newParams);
    }
    if (name === "brand") {
      if (checked) {
        if (!brand.includes(value)) {
          brand.push(value);
        }
      } else {
        brand = [...new Set(brand)];

        brand = brand.filter((brnd) => brnd !== value);
      }

      // Create new search params from scratch

      if (brand.length > 0) {
        newParams.set("brand", brand.join(","));
      } else {
        newParams.delete("brand");
      }
      setSearchParams(newParams);
    }
    if (name === "sales") {
      if (value) {
        newParams.set("sale", true);
      } else {
        newParams.delete("sale");
      }
      setSearchParams(newParams);
    }
  };
  const handleOnClick = (name, value) => {
    const p = { ...filtered };
    p.minPrice = value[0];
    p.maxPrice = value[1];
    searchParams.set("maxPrice", p.maxPrice);
    searchParams.set("minPrice", p.minPrice);
    setSearchParams(searchParams);

    dispatch(setFiltered(p));
  };

  return (
    <div className="mx-auto px-4">
      {/* Breadcrumb only at the top */}
      <div className="bg-gray-100 p-4 mb-6">
        <Breadcrumb className="flex flex-wrap items-center space-x-1 text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-foreground hover:text-primary"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="mx-2">{">"}</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/allproducts" className="text-foreground">
              All Products
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Main layout: sidebar + product grid */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        {showFilter && (
          <aside className="w-full md:w-64 space-y-4 shrink-0">
            <FilterSidebar
              handleOnChecked={handleOnChecked}
              maxPrice={maxPrice}
              handleOnClick={handleOnClick}
              searchParams={searchParams}
            />
          </aside>
        )}

        {/* Right Product Grid */}
        <main
          className={`${showFilter ? "flex-grow" : "w-full"} transition-all duration-300`}
        >
          {/* Top row with heading and toggle */}
          <div className="flex items-center justify-between ">
            <h3 className="text-2xl font-bold text-gray-800">All Products</h3>

            {FilterProduct.length > 0 && (
              <h4 className="text-2xl font-bold text-gray-800">
                Found {FilterProduct.length} out of {products.length}
              </h4>
            )}

            <button
              className="text-sm text-blue-600 flex items-center gap-1"
              onClick={() => setShowFilter(!showFilter)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilter ? "Hide Filters" : "Show Filters"}
            </button>

            <Collapse
              feature="Featured"
              Newest="Newest"
              phl="Price: High-Low"
              plh="Price: Low-High"
              title="Sort By"
              handleOnSortOption={handleOnSortOption}
            />
          </div>
          {/* AllProductList Component */}{" "}
          <AllProductList
            setProductList={setProductList}
            productList={productList.length > 0 ? productList : []}
          />
        </main>
      </div>
    </div>
  );
};

export default AllProductsPage;
