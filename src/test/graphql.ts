export const registerUserMutation = `
mutation registerUser($data: UserCreateInput!) {
  registerUser(data: $data) {
    token
    user {
      id
      role
      firstName
      lastName
      email
    }
  }
}
`

export const createBusinessMutation = `
mutation createBusinessWithOfferings(
    $data: CreateBusinessWithOfferingsInput
  ) {
    createBusinessWithOfferings(data: $data) {
      id
      description   
      createdAt     
      updatedAt     
      ownerId          
      address   
      ownerId
      offerings {
        id
        createdAt
        updatedAt
        cost
        address
        imageUrl
        videoUrl
        description
        title
      }
      name          
      tagline       
      logoUrl       
      coverUrl      
      socialLinks   
      externalLinks 
      phoneNumber   
      creditAmount  
      creditScore   
      approved      
      handle       
    }
  }
`

export const createTransactionMutation = `
mutation createTransaction($data: CreateTransactionInput!) {
  createTransaction(data: $data) {
    recipientId
    senderId
    amount
  }
}
`

export const createOrderMutation = `
mutation createOrder($data: CreateOrderInput!) {
  createOrder(data: $data) {
    id
    createdAt
    updatedAt
    transactionId
    quantity
    amount
    note
    state
  }
}
`

export const issueOrderRefundMutation = `
mutation issueOrderRefund($id: ID!) {
  issueOrderRefund(id: $id) {
    id
    createdAt
    updatedAt
    transactionId
    quantity
    amount
    note
    state
  }
}

`

export const businessBalanceQuery = `
query businessBalance($id: ID!) {
  businessBalance(id: $id)
}
`

export const allOrdersQuery = `
query allOrders {
  allOrders {
    id
    createdAt
    updatedAt
    transactionId
    quantity
    amount
    note
    state
  }
}
`
