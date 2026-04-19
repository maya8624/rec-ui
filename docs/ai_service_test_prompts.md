# AI Service Test Prompts

---

## general → agent_node
*Plain LLM response*

1. Hi, what can you help me with?
2. What's the difference between renting and buying?
3. How does the property settlement process work?

---

## document_query → vector_search_node → agent_node

4. What are your office hours?
5. How do I break my lease early?
6. What is your pet policy?
7. Who is the principal agent at your agency?
    -> TODO: his number as a following question doesn't work?

8. What is the bond amount for a rental property?

---

## search → listing_search_node → agent_node

9. Show me 3 bedroom Apartments in Sydney under $1000000 
10. Find apartments with 2 bathrooms for rent
11. List townhouses in Melbourne under $600k
12. I'm looking for an unit in Castle Hill with a budget of $1million
- show me the property on 177 Castlereagh St, Syeney'

---

## hybrid_search → hybrid_search_node → agent_node
*Triggers both search + document_query keywords*

13. Show me properties in Castle Hill and what are your office hours?
14. Find me a 2 bedroom apartment and tell me about the lease terms
15. List houses for rent and explain the bond conditions

---

## booking → agent_node → tools_node → context_update_node → agent_node

16. I'd like to book an inspection for property 08d1202e-cd7e-d6cc-f2b3-c309f377d123
17. When is the next open home available?
18. Can I schedule a viewing for this weekend?
19. I want to arrange an inspection — what times are available?

---

## cancellation → agent_node → tools_node

20. I want to cancel my inspection booking CONF-12345
21. Please withdraw my booking
22. I no longer need the inspection, can you remove the booking?

---

## search_then_book compound → listing_search_node → prompts to pick a property

23. Find me 2 bedroom apartments in Sydney and book an inspection
24. Show me houses under $700k and schedule a viewing

---

## Compound (non-search+book) → early_response
*Graph exits without LLM*

25. Book an inspection and cancel my booking CONF-12345