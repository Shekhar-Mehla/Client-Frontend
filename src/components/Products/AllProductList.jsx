import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchFilterProductAction,
  fetchProductAction,
} from "../../features/product/productAction";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { buildQuery } from "../../utility/buildQuery";
import { setProducts } from "../../features/product/productSlice";
import { setFiltered } from "../../features/filters/filterSlice";

const AllProductList = ({
  setProductList,
  productList,

  filters,
  hasActiveFilters,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const { products, FilterProduct } = useSelector((state) => state.productInfo);
  const [searchParams, setSearchParams] = useSearchParams();
  const { filtered } = useSelector((state) => state.filterInfo);

  const debouncedFetch = useRef(null);
  const ref = useRef(true);
  // fetch all products when component mounts

  useEffect(() => {
    if (FilterProduct?.length > 0) {
      setProductList([...FilterProduct]);

      return;
    }

    if (products && products.length > 0 && ref.current) {
      return setProductList([...products]);
    }

    // console.log(FilterProduct.length);
    if (!FilterProduct.length) {
      setProductList([]);
    }
    ref.current = false;
  }, [dispatch, products, FilterProduct]);

  // another useEffect

  if (!debouncedFetch.current) {
    debouncedFetch.current = (function () {
      console.log("hello");
      let id;
      return (query) => {
        clearTimeout(id);
        id = setTimeout(() => {
          dispatch(fetchFilterProductAction(query));
        }, 1000);
      };
    })();
  }

  useEffect(() => {
    console.log(location.search);
    debouncedFetch.current(location.search);
  }, [searchParams]);

  //function to toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((wishlist) => wishlist !== id)
        : [...prev, id]
    );
  };

  //function to calculate discount percentage
  const calculateDiscountPercentage = (price, discountPrice) => {
    return price !== discountPrice
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;
  };

  //function to check if product is wishlisted
  const isProductWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {productList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productList?.map((product) => {
              const discountPercentage = calculateDiscountPercentage(
                product.price,
                product.discountPrice
              );

              const isWishlisted = isProductWishlisted(productList._id);

              return (
                <Card
                  key={product._id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white m-0 p-0"
                  onClick={() => {
                    navigate(`/product-detail/${product.slug}`);
                  }}
                >
                  <CardContent className="p-0 m-0">
                    {/* Product Image */}
                    <div
                      className="relative aspect-square bg-gray-100 overflow-hidden rounded-t-lg"
                      style={{ margin: 0, padding: 0, lineHeight: 0 }}
                    >
                      <img
                        src={product.thumbnail || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      {discountPercentage > 0 && product.discountPrice > 0 && (
                        <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                          -{discountPercentage}%
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={() => toggleWishlist(product._id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {product.brand}
                        </Badge>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            $
                            {product.discountPrice > 0
                              ? product.discountPrice
                              : product.price}
                          </span>
                          {product.price !== product.discountPrice &&
                            product.discountPrice > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price}
                              </span>
                            )}
                        </div>
                        {product.stock === 0 ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-red-600 border-red-200"
                          >
                            Out of stock
                          </Badge>
                        ) : product.stock <= 10 ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-orange-600 border-orange-200"
                          >
                            Only {product.stock} left
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div>No product found</div>
        )}
      </div>
    </div>
  );
};

export default AllProductList;
