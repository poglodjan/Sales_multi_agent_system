from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import OpenAI
import json
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Dane tabeli Sales
sales_data = [
        # Anomalie:
    {"OrderID": "ORD0021", "OrderDate": "2025-07-20", "Region": "Café Cluster", "FranchiseeID": "FRAN003", "ProductID": "PROD021",
     "Quantity": 50, "UnitPrice": 3.58, "TotalAmount": 279, "AllocatedFacings": 84, "ExpectedFacings": 53},  # Chips - nadmiar
    {"OrderID": "ORD0022", "OrderDate": "2025-07-21", "Region": "Café Cluster", "FranchiseeID": "FRAN003", "ProductID": "PROD022",
     "Quantity": 45, "UnitPrice": 7.14, "TotalAmount": 421, "AllocatedFacings": 72, "ExpectedFacings": 42},  # Chips - nadmiar
    {"OrderID": "ORD0023", "OrderDate": "2025-07-22", "Region": "Café Cluster", "FranchiseeID": "FRAN002", "ProductID": "PROD023",
     "Quantity": 60, "UnitPrice": 5.00, "TotalAmount": 440, "AllocatedFacings": 93, "ExpectedFacings": 62},  # Health & Beauty - nadmiar
    {"OrderID": "ORD0001", "OrderDate": "2025-07-20", "Region": "North", "FranchiseeID": "FRAN003", "ProductID": "PROD017",
     "Quantity": 12, "UnitPrice": 3.58, "TotalAmount": 42.96, "AllocatedFacings": 31, "ExpectedFacings": 31},
    {"OrderID": "ORD0002", "OrderDate": "2024-04-27", "Region": "North", "FranchiseeID": "FRAN003", "ProductID": "PROD001",
     "Quantity": 3, "UnitPrice": 7.14, "TotalAmount": 21.42, "AllocatedFacings": 50, "ExpectedFacings": 20},
    {"OrderID": "ORD0003", "OrderDate": "2024-06-16", "Region": "West", "FranchiseeID": "FRAN002", "ProductID": "PROD004",
     "Quantity": 12, "UnitPrice": 7.44, "TotalAmount": 89.28, "AllocatedFacings": 32, "ExpectedFacings": 32},
    {"OrderID": "ORD0004", "OrderDate": "2024-09-28", "Region": "North", "FranchiseeID": "FRAN002", "ProductID": "PROD015",
     "Quantity": 14, "UnitPrice": 24.4, "TotalAmount": 341.6, "AllocatedFacings": 41, "ExpectedFacings": 41},
    {"OrderID": "ORD0005", "OrderDate": "2025-10-14", "Region": "North", "FranchiseeID": "FRAN001", "ProductID": "PROD018",
     "Quantity": 1, "UnitPrice": 26.49, "TotalAmount": 26.49, "AllocatedFacings": 22, "ExpectedFacings": 22},
    {"OrderID": "ORD0006", "OrderDate": "2025-11-04", "Region": "North", "FranchiseeID": "FRAN003", "ProductID": "PROD001",
     "Quantity": 13, "UnitPrice": 20.22, "TotalAmount": 262.86, "AllocatedFacings": 25, "ExpectedFacings": 25},
    {"OrderID": "ORD0007", "OrderDate": "2025-12-08", "Region": "South", "FranchiseeID": "FRAN003", "ProductID": "PROD019",
     "Quantity": 3, "UnitPrice": 28.06, "TotalAmount": 84.18, "AllocatedFacings": 35, "ExpectedFacings": 35},
    {"OrderID": "ORD0008", "OrderDate": "2025-02-21", "Region": "South", "FranchiseeID": "FRAN003", "ProductID": "PROD020",
     "Quantity": 20, "UnitPrice": 18.31, "TotalAmount": 366.2, "AllocatedFacings": 35, "ExpectedFacings": 35},
    {"OrderID": "ORD0009", "OrderDate": "2024-01-02", "Region": "East", "FranchiseeID": "FRAN001", "ProductID": "PROD008",
     "Quantity": 19, "UnitPrice": 24.19, "TotalAmount": 459.61, "AllocatedFacings": 49, "ExpectedFacings": 49},
    {"OrderID": "ORD0010", "OrderDate": "2025-02-27", "Region": "West", "FranchiseeID": "FRAN001", "ProductID": "PROD006",
     "Quantity": 6, "UnitPrice": 10.23, "TotalAmount": 61.38, "AllocatedFacings": 28, "ExpectedFacings": 28},
    {"OrderID": "ORD0011", "OrderDate": "2025-03-24", "Region": "South", "FranchiseeID": "FRAN001", "ProductID": "PROD008",
     "Quantity": 9, "UnitPrice": 5.64, "TotalAmount": 50.76, "AllocatedFacings": 37, "ExpectedFacings": 37},
    {"OrderID": "ORD0012", "OrderDate": "2025-04-01", "Region": "West", "FranchiseeID": "FRAN001", "ProductID": "PROD011",
     "Quantity": 10, "UnitPrice": 22.66, "TotalAmount": 226.6, "AllocatedFacings": 36, "ExpectedFacings": 36},
    {"OrderID": "ORD0013", "OrderDate": "2025-04-01", "Region": "South", "FranchiseeID": "FRAN002", "ProductID": "PROD011",
     "Quantity": 5, "UnitPrice": 16.55, "TotalAmount": 82.75, "AllocatedFacings": 25, "ExpectedFacings": 25},
    {"OrderID": "ORD0014", "OrderDate": "2024-09-13", "Region": "West", "FranchiseeID": "FRAN003", "ProductID": "PROD016",
     "Quantity": 12, "UnitPrice": 9.04, "TotalAmount": 108.48, "AllocatedFacings": 33, "ExpectedFacings": 33},
    {"OrderID": "ORD0015", "OrderDate": "2024-08-28", "Region": "West", "FranchiseeID": "FRAN003", "ProductID": "PROD007",
     "Quantity": 19, "UnitPrice": 26.32, "TotalAmount": 500.08, "AllocatedFacings": 42, "ExpectedFacings": 42},
    {"OrderID": "ORD0016", "OrderDate": "2024-11-11", "Region": "North", "FranchiseeID": "FRAN004", "ProductID": "PROD009",
     "Quantity": 3, "UnitPrice": 28.95, "TotalAmount": 86.85, "AllocatedFacings": 21, "ExpectedFacings": 21},
    {"OrderID": "ORD0017", "OrderDate": "2024-04-01", "Region": "West", "FranchiseeID": "FRAN004", "ProductID": "PROD015",
     "Quantity": 17, "UnitPrice": 16.38, "TotalAmount": 278.46, "AllocatedFacings": 45, "ExpectedFacings": 45},
    {"OrderID": "ORD0018", "OrderDate": "2024-02-04", "Region": "South", "FranchiseeID": "FRAN004", "ProductID": "PROD012",
     "Quantity": 19, "UnitPrice": 16.66, "TotalAmount": 316.54, "AllocatedFacings": 35, "ExpectedFacings": 35},
    {"OrderID": "ORD0019", "OrderDate": "2025-02-25", "Region": "West", "FranchiseeID": "FRAN004", "ProductID": "PROD006",
     "Quantity": 10, "UnitPrice": 29.19, "TotalAmount": 291.9, "AllocatedFacings": 22, "ExpectedFacings": 22},
    {"OrderID": "ORD0020", "OrderDate": "2024-06-24", "Region": "South", "FranchiseeID": "FRAN004", "ProductID": "PROD014",
     "Quantity": 14, "UnitPrice": 13.89, "TotalAmount": 194.46, "AllocatedFacings": 32, "ExpectedFacings": 32},
    {"OrderID": "ORD0024", "OrderDate": "2025-07-22", "Region": "North", "FranchiseeID": "FRAN002", "ProductID": "PROD024",
     "Quantity": 10, "UnitPrice": 6.00, "TotalAmount": 60, "AllocatedFacings": 35, "ExpectedFacings": 35},  # normalny
    {"OrderID": "ORD0025", "OrderDate": "2025-07-23", "Region": "South", "FranchiseeID": "FRAN001", "ProductID": "PROD025",
     "Quantity": 8, "UnitPrice": 8.00, "TotalAmount": 64, "AllocatedFacings": 36, "ExpectedFacings": 36}   # normalny
]

# Dane tabeli Product
product_data = [
    {"ProductID": "PROD001", "ProductName": "Milk 1L", "Category": "Dairy", "Subcategory": "Milk"},
    {"ProductID": "PROD002", "ProductName": "Bread", "Category": "Bakery", "Subcategory": "Bread"},
    {"ProductID": "PROD003", "ProductName": "Butter 200g", "Category": "Dairy", "Subcategory": "Butter"},
    {"ProductID": "PROD004", "ProductName": "Apple 1kg", "Category": "Fruits", "Subcategory": "Fresh"},
    {"ProductID": "PROD005", "ProductName": "Banana 1kg", "Category": "Fruits", "Subcategory": "Fresh"},
    {"ProductID": "PROD006", "ProductName": "Chicken Breast 1kg", "Category": "Meat", "Subcategory": "Poultry"},
    {"ProductID": "PROD007", "ProductName": "Pasta 500g", "Category": "Grocery", "Subcategory": "Dry Food"},
    {"ProductID": "PROD008", "ProductName": "Rice 1kg", "Category": "Grocery", "Subcategory": "Dry Food"},
    {"ProductID": "PROD009", "ProductName": "Eggs 10pcs", "Category": "Dairy", "Subcategory": "Eggs"},
    {"ProductID": "PROD010", "ProductName": "Orange Juice 1L", "Category": "Beverages", "Subcategory": "Juice"},
    {"ProductID": "PROD011", "ProductName": "Cola 1.5L", "Category": "Beverages", "Subcategory": "Soda"},
    {"ProductID": "PROD012", "ProductName": "Yogurt 150g", "Category": "Dairy", "Subcategory": "Yogurt"},
    {"ProductID": "PROD013", "ProductName": "Tomato 1kg", "Category": "Vegetables", "Subcategory": "Fresh"},
    {"ProductID": "PROD014", "ProductName": "Potato 1kg", "Category": "Vegetables", "Subcategory": "Fresh"},
    {"ProductID": "PROD015", "ProductName": "Carrot 1kg", "Category": "Vegetables", "Subcategory": "Fresh"},
    {"ProductID": "PROD016", "ProductName": "Onion 1kg", "Category": "Vegetables", "Subcategory": "Fresh"},
    {"ProductID": "PROD017", "ProductName": "Cheese 500g", "Category": "Dairy", "Subcategory": "Cheese"},
    {"ProductID": "PROD018", "ProductName": "Ham 200g", "Category": "Meat", "Subcategory": "Processed"},
    {"ProductID": "PROD019", "ProductName": "Coffee 250g", "Category": "Beverages", "Subcategory": "Hot Drinks"},
    {"ProductID": "PROD020", "ProductName": "Tea 50pcs", "Category": "Beverages", "Subcategory": "Hot Drinks"},
    {"ProductID": "PROD021", "ProductName": "Salted Chips 200g", "Category": "Chips", "Subcategory": "Snacks"},
    {"ProductID": "PROD022", "ProductName": "Cheese Chips 200g", "Category": "Chips", "Subcategory": "Snacks"},
    {"ProductID": "PROD023", "ProductName": "Shampoo 500ml", "Category": "Health & Beauty", "Subcategory": "Haircare"},
    {"ProductID": "PROD024", "ProductName": "Conditioner 500ml", "Category": "Health & Beauty", "Subcategory": "Haircare"},
    {"ProductID": "PROD025", "ProductName": "Body Lotion 200ml", "Category": "Health & Beauty", "Subcategory": "Skincare"},
]

# Dane tabeli Franchisee
franchisee_data = [
    {"FranchiseeID": "FRAN001", "FranchiseeName": "Sakura Shop", "City": "Tokyo", "Region": "East"},
    {"FranchiseeID": "FRAN002", "FranchiseeName": "Dragon Pearl Shop", "City": "Singapur", "Region": "South"},
    {"FranchiseeID": "FRAN003", "FranchiseeName": "Golden Temple Shop", "City": "Bangkok", "Region": "South"},
    {"FranchiseeID": "FRAN004", "FranchiseeName": "Himalayan Shop", "City": "Singapur", "Region": "South"}
]

# Przechowujemy początkowy prompt i dane tabel w pamięci
initial_system_prompt = """
You are a Sales Data Assistant. Your role is to help users analyze and interpret sales, franchise, and product information.
Answer questions shortly (no complex explanations just listing) using the provided data tables.
Always look for the most relevant data source depending on the type of question.

Use table_sales for all questions about orders, revenue, quantities, or time trends.
Use table_franchisees for store, location, and franchise performance questions.
Use table_products for product details, categories, or mix analysis.

Join data using:
table_sales.FranchiseeID = table_franchisees.FranchiseeID
table_sales.ProductID = table_products.ProductID
Prefer table_sales.Region for sales analysis, table_franchisees.Region for store details.

# Table data
table_sales = {sales_data}
table_franchisees = {franchisee_data}
table_products = {product_data}
""".format(
    sales_data=json.dumps(sales_data),
    franchisee_data=json.dumps(franchisee_data),
    product_data=json.dumps(product_data),
)

# Historia rozmowy
conversation_history = [
    {"role": "system", "content": initial_system_prompt}
]

api_key = "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"
if not api_key:
    raise ValueError("OPENAI_API_KEY nie jest ustawiony!")
client = OpenAI(api_key=api_key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# frontend serving
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

@app.get("/")
async def serve_frontend():
    return FileResponse(os.path.join(dist_dir, "index.html"))

# catch-all dla wszystkich innych ścieżek SPA
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse(os.path.join(dist_dir, "index.html"))

@app.post("/chat/stream")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")

    conversation_history.append({"role": "user", "content": user_message})

    def generate_stream():
        with client.chat.completions.stream(
            model="gpt-4o",
            messages=conversation_history,
        ) as stream:
            for event in stream:
                if event.type == "content.delta":
                    text_chunk = event.delta
                    if isinstance(text_chunk, str):
                        yield f"data: {json.dumps({'content': text_chunk})}\n\n"
                elif event.type == "content.done":
                    yield "data: [DONE]\n\n"

        conversation_history.append({"role": "assistant", "content": ""})

    return StreamingResponse(generate_stream(), media_type="text/event-stream")
