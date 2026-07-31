-- Remove the placeholder sample product
delete from products where slug = 'sample-product';

-- Draft products — swap images, prices, and supplier_url once you've
-- researched actual suppliers. cost_price/sell_price below are placeholder
-- estimates based on typical AliExpress/CJ pricing for these categories —
-- verify against your actual supplier quote before treating margin as real.

insert into products (name, slug, description, images, cost_price, sell_price, supplier_url, stock_status)
values
(
  'Modular Cable Management Box',
  'cable-management-box',
  'Hides your power strip and tangled cables in one clean box. Slides under a desk or against a wall, cable slots on both ends so cords still reach where they need to.',
  array['https://placehold.co/600x600?text=Cable+Box'],
  280.00,
  749.00,
  null,
  'in_stock'
),
(
  'Foldable Aluminum Laptop Stand',
  'foldable-laptop-stand',
  'Raises your laptop to eye level and improves airflow underneath. Folds flat for a bag, adjustable to multiple angles, holds up to 15-inch laptops.',
  array['https://placehold.co/600x600?text=Laptop+Stand'],
  350.00,
  899.00,
  null,
  'in_stock'
),
(
  'RGB LED Strip Lights with Remote',
  'led-strip-lights',
  '5-meter strip with 16 colors and multiple modes, controlled by remote or app. Sticks to the back of a desk, shelf, or wall for ambient room lighting.',
  array['https://placehold.co/600x600?text=LED+Strip'],
  300.00,
  799.00,
  null,
  'in_stock'
);
