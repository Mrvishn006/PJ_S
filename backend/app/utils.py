import math
from typing import Dict, Any

def format_indian_currency(amount: int | float) -> str:
    """
    Formats a number into standard Indian numbering format (e.g., ₹4,50,30,710).
    Last 3 digits form the first grouping; preceding digits are grouped in pairs of two.
    """
    if amount is None or math.isnan(amount):
        return "₹0"
    
    val = int(round(amount))
    is_negative = val < 0
    val_str = str(abs(val))
    
    if len(val_str) <= 3:
        formatted = val_str
    else:
        last3 = val_str[-3:]
        remaining = val_str[:-3]
        # Group remaining digits from right to left in pairs of 2
        groups = []
        while len(remaining) > 2:
            groups.append(remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            groups.append(remaining)
        groups.reverse()
        formatted = ",".join(groups) + "," + last3
        
    return f"{'-' if is_negative else ''}₹{formatted}"

def format_price_per_sqft(rate: int | float) -> str:
    """
    Formats price per square foot with currency and unit (e.g. ₹30,020/sq ft).
    """
    return f"{format_indian_currency(rate)}/sq ft"

def generate_decision_explanation(
    estimated_price: int,
    price_per_sqft: int,
    square_footage: float,
    location: str,
    property_type: str,
    primary_driver: str,
    primary_weight_pct: float,
    metro_distance: float,
    property_age: int,
    schools_nearby: int,
    hospitals_nearby: int,
    bedrooms: int,
    bathrooms: int
) -> tuple[str, str]:
    """
    Generates natural-language technical explanation from the prediction.
    Strictly follows Section 21 of the specification.
    """
    formatted_total = format_indian_currency(estimated_price)
    formatted_rate = format_price_per_sqft(price_per_sqft)
    formatted_sqft = f"{int(round(square_footage)):,} SQ FT"
    
    # Structure descriptive naming
    if "STANDALONE" in property_type.upper():
        prop_label = "INDEPENDENT OWN STANDALONE BUILDING"
    elif "GATED" in property_type.upper():
        prop_label = "GATED COMMUNITY ENCLAVE UNIT"
    else:
        prop_label = "PREMIUM VILLA / HIGH-RISE APARTMENT"
        
    sentence1 = (
        f"ESTIMATED VALUATION IS {formatted_total} AT {formatted_rate} "
        f"FOR THIS {formatted_sqft} {prop_label} IN {location.upper()}."
    )
    
    sentence2 = (
        f"THE PRIMARY DRIVER VARIABLE OF THIS VALUATION IS {primary_driver.upper()} "
        f"({primary_weight_pct:.1f}% RELATIVE IMPORTANCE WEIGHT). "
        f"CONNECTIVITY FACTOR OF {metro_distance:.1f} KM TO METRO TRANSIT, "
        f"ASSET AGE PROFILE ({property_age} YRS), AND AMENITY CONVERGENCE "
        f"({schools_nearby} SCHOOLS, {hospitals_nearby} HOSPITALS) CONTRIBUTE AS "
        f"SECONDARY REGRESSION SPLIT DRIVERS FOR THIS {bedrooms}BHK/{bathrooms}BA VALUATION."
    )
    
    return sentence1, sentence2
