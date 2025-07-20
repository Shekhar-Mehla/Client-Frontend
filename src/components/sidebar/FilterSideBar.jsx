import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { ChevronDown, Circle } from "lucide-react";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

//  Reusable collapsible section
const FilterSection = ({
  title,
  options = [],
  handleOnChecked,
  handleOnClick,
  maxPrice,
  minPrice,
  name,
  colors = [],
}) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([0, maxPrice]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const gender = location.pathname.replace("/allproducts", "").split("/")[1];

 
  return (
    <div className="space-y-3">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex justify-between items-center w-full py-2 text-xl font-medium">
          {title}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="pl-2 pt-2 space-y-2">
          {/* mainCategory,brand ,sales and offers */}

          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-2 text-base"
            >
              <Checkbox
                id={option.id}
                checked={
                  searchParams.getAll("mainCategory")?.includes(option.value) ||
                  gender === option.value
                    ? true
                    : ""
                }
                onCheckedChange={(checked) =>
                  handleOnChecked(option.name, option.value, checked)
                }
              />

              <Label htmlFor={option.id} className="text-base">
                {option.label}
              </Label>
            </div>
          ))}

          {/* Price Slider */}
          {typeof maxPrice === "number" && typeof minPrice === "number" && (
            <>
              <div className="text-lg font-medium pt-4">Price Range</div>
              <div className="text-base text-gray-600">
                ${range[0] ?? 0} – ${range[1] ?? maxPrice}
              </div>
              <div className="flex justify-center">
                <Slider
                  value={range}
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  onValueChange={(val) => setRange(val)}
                  className="w-60"
                  name="price"
                />
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-sm cursor-pointer"
                  onClick={() => handleOnClick(name, range)}
                >
                  Go
                </Button>
              </div>
            </>
          )}

          {/* sales and Offer */}
          {name == "sales" && (
            <div className="flex gap-2">
              <Checkbox onCheckedChange={(e) => handleOnChecked(name, e)} />
              <Label className="text-base">{"Sales"}</Label>
            </div>
          )}

          {/* Color filter */}
          <div className="flex flex-wrap gap-5">
            {colors.map((color) => {
              return (
                <div key={color.id}>
                  <Checkbox
                    className={`rounded-full size-10 }`}
                    style={{ backgroundColor: color.value }}
                    onCheckedChange={(checked) => {
                      handleOnChecked(color.name, color.value, checked);
                    }}
                  />
                  {/* {isSelected && <Check size={14} className="ml-1" />} */}

                  <Label htmlFor={color.id} className="text-base">
                    {color.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

//  Sidebar component

const FilterSidebar = ({ handleOnChecked, maxPrice, handleOnClick }) => {
  const { products, FilterProduct } = useSelector((state) => state.productInfo);
  const path = location.pathname.replace("/allproducts", "");
  // const { filtered } = useSelector((state) => state.filterInfo);

  const gender = path.split("/")[1] || "";

  const genderOptions = [
    ...new Set(products.map((product) => product.mainCategory)),
  ].map((Category) => {
    return {
      id: Category,
      label: Category?.charAt(0)?.toUpperCase() + Category.slice(1),
      value: Category,
      name: "mainCategory",
    };
  });

  const saleOptions = [{ id: "sale", label: "Sale", name: "sales", value: "" }];

  const colorSet = new Set(
    products.flatMap((product) => product.colors.map((c) => c.toLowerCase()))
  );

  const colorsOptions = [...colorSet].map((color) => ({
    id: color,
    name: "colors",
    value: color.toLowerCase(),
    label: color.charAt(0).toUpperCase() + color.slice(1),
    // filters: { filtered },
  }));

  const brandOptions = [
    ...new Set(products.map((product) => product.brand.toLowerCase())),
  ].map((brand) => ({
    id: brand,
    label: brand.charAt(0).toUpperCase() + brand.slice(1),
    value: brand,
    name: "brand",
  }));

  return (
    <div className=" p-4 space-y-4 border rounded-md bg-white shadow-sm ">
      <FilterSection
        title="Gender"
        options={genderOptions}
        handleOnChecked={handleOnChecked}
      />

      <Separator />
      <FilterSection
        title="Shop by Price"
        maxPrice={maxPrice}
        minPrice={0}
        handleOnClick={handleOnClick}
        name="price"
      />
      <Separator />
      <FilterSection
        title="Sale and Offers"
        name="sales"
        handleOnChecked={handleOnChecked}
      />
      <Separator />
      <FilterSection
        title="Colour"
        colors={colorsOptions}
        handleOnChecked={handleOnChecked}
      />
      <Separator />
      <FilterSection
        title="Brand"
        options={brandOptions}
        handleOnChecked={handleOnChecked}
        label={brandOptions}
      />
    </div>
  );
};

export default FilterSidebar;
