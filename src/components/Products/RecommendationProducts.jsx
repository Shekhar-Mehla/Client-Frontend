import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

import reviewStar from "../../utils/reviewStar";
import Rating from "../star/Rating";
import {
  fetchWishlistAction,
  getUserAction,
  toggleWishlistAction,
} from "../../features/user/userAction";
import { toast } from "react-toastify";
import userInteractionObj from "../../utils/interactionId";
import { postUserIntersction } from "../../features/userInteractions/userInteractionApi";

const RecommendationProducts = () => {
  const { recomedateProducts } = useSelector((state) => state.productInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, wishlistProducts } = useSelector((state) => state.user);

  const isLoggedIn = !!user && !!user._id;
  // const [wishlist, setWishlist] = useState([]);
  const handleToggleWishlist = (productId) => {
    if (!isLoggedIn) {
      toast.error("You must be Logged In to use the wishlist");
      return;
    }
    dispatch(toggleWishlistAction(productId));
  };

  const calculateDiscountPercentage = (price, discountPrice) => {
    return price !== discountPrice
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlistAction());
    }
  }, [dispatch, user?._id]);
  return (
    recomedateProducts.lenght > 0 && (
      <section className="px-8 mb-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Recommended Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recomedateProducts?.map((product) => {
            const discountPercentage = calculateDiscountPercentage(
              product.price,
              product.discountPrice
            );
            const { fullstarrating, halfstar, emptystars } = reviewStar(
              product.reviews
            );

            return (
              <Card
                key={product._id}
                className="group hover:shadow-lg transition-all duration-300 bg-white m-0 p-0"
                onClick={() => {
                  const recomedationObj = userInteractionObj({
                    productId: product?._id,
                    userId: user?._id,
                    type: "view",
                  });

                  postUserIntersction(recomedationObj);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product._id);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlistProducts.includes(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
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
                      <Rating
                        fullstarrating={fullstarrating}
                        halfstar={halfstar}
                        emptystars={emptystars}
                      ></Rating>
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
      </section>
    )
  );
};
export default RecommendationProducts;
