import { useState, useEffect } from "react";
import axios from "axios";
import { Minus, Plus, Trash2, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartFromStorage,
  updateCartItemQuantity,
} from "../../features/cart/cartAction";
import { getOrCreateGuestId } from "../../utils/guestId";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const { cartItems } = useSelector((state) => state.cartInfo);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    dispatch(fetchCartFromStorage());
  }, [dispatch]);

  // delete item from cart
  const handleDelete = (itemId) => {
    dispatch(deleteCartItem(itemId));
    toast.success("Item removed from cart");
  };

  //update quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent going below 1
    dispatch(updateCartItemQuantity(itemId, newQuantity));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 150 ? 0 : 7.99;
  const total = subtotal - discount + shipping;
  console.log("Cart item sample:", cartItems[0]);
  //this is sample for the checkout
  const handleOnCheckout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/order/placeOrder`,
        {
          cart: cartItems.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
          })),
          paymentMethod: "Card",
          guestId: getOrCreateGuestId(),
          guestInfo: {
            name: "Dinesh Budhathoki",
            email: "abc@gmail.com",
            phone: "12345",
          },
        },
        {
          withCredentials: true,
        }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate checkout.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-20 w-20 text-gray-300 mb-6" />
            <h1 className="text-2xl font-medium text-black mb-3">
              Your Bag is empty
            </h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Once you add something to your bag - it will appear here. Ready to
              get started?
            </p>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full"
              onClick={() => navigate("/allProducts")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-black mb-2">Bag</h1>
          <p className="text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
              {cartItems.map((item, index) => (
                <div key={item.id || item._id}>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <div className="w-36 h-36 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.product_title}
                          width={144}
                          height={144}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Details & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      {/* Product Title */}
                      <h3 className="text-base font-medium text-black leading-tight mb-1">
                        {item.product_title}
                      </h3>
                      {/* mainCategory */}
                      <p className="text-gray-500 text-sm mb-0">
                        {item.mainCategory}
                      </p>
                      {/* color */}
                      <p className="text-gray-500 text-sm mb-0">
                        Color:{" "}
                        <span className="font-medium text-black">
                          {item.color}
                        </span>
                      </p>
                      {/* size */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-0">
                        <span>Size</span>
                        <span className="font-medium text-black">
                          {item.size}
                        </span>
                      </div>
                      {/* quantity */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-0">
                        <span>Quantity</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-black w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {/* delete & wishlist button and price - stack on mobile, row on desktop */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                        <div className="flex items-center gap-3 order-2 sm:order-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-gray-100"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-gray-100"
                            onClick={() => handleDelete(item.id || item._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="order-1 sm:order-2 text-left sm:text-right">
                          {item.discountPrice &&
                          item.discountPrice < item.price ? (
                            <>
                              <p className="text-sm text-gray-400 line-through mb-1">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="font-medium text-black">
                                $
                                {(item.discountPrice * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="font-medium text-black">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < cartItems.length - 1 && (
                    <Separator className="mt-8" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="bg-white border-0 lg:sticky lg:top-8">
              <h2 className="text-xl font-medium text-black mb-6">Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black">${subtotal.toFixed(2)}</span>
                </div>

                {isPromoApplied && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Discount (NIKE10)</span>
                    <span className="text-green-600">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base">
                  <span className="text-gray-600">
                    Estimated Delivery & Handling
                  </span>
                  <span className="text-black">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-medium">
                  <span className="text-black">Total</span>
                  <span className="text-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Free delivery</span> on orders
                    over $150.00
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add ${(150 - subtotal).toFixed(2)} to qualify
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border-gray-200 focus:border-black"
                  />
                  <Button
                    variant="outline"
                    className="border-gray-200 hover:border-black bg-transparent"
                    onClick={() => {
                      if (promoCode.trim()) {
                        setIsPromoApplied(true);
                        toast.success("Promo code applied successfully!");
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
                {isPromoApplied && (
                  <p className="text-sm text-green-600">
                    Promo code applied successfully!
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-full text-base font-medium"
                  size="lg"
                  // onClick={handleOnCheckout}
                  onClick={() => navigate("/checkout/option")}
                >
                  {/* Checkout */}
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
