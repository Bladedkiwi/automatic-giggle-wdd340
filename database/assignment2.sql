-- Add admin
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n',
        'admin'
);

-- Remove admin
DELETE FROM public.account WHERE account_firstname = 'Tony';

-- Change text description of GM Hummer to include 'a huge interior' instead of 'the small interiors'
UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') WHERE inv_make = 'GM' and inv_model = 'Hummer';

-- Find Sports Cars from inventory
SELECT
    public.classification.classification_name,
    public.inventory.inv_make,
    public.inventory.inv_model
FROM public.classification
    INNER JOIN public.inventory
        USING(classification_id) WHERE classification_id = 2;

-- Update file paths of image and thumbnail to include /vehicles
UPDATE public.inventory SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles'), inv_image = REPLACE(inv_image, '/images', '/images/vehicles')
