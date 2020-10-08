<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.pegatron.exercise6.model.Bookstore"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Bookstore Application</title>
<link href="../css/buttonStyle.css" rel="stylesheet">
<link href="../css/listStyle.css" rel="stylesheet">
</head>
<body>

	<h1>Bookstores Management</h1>

	<a href="create"><button type="button" class="create">Create</button></a>
	<br><br>	
			
	<table class="bookstore_list_table">
		<thead>
			<tr>
				<th><b>Name</b></th>
				<th><b>Address</b></th>
				<th><b>Tel</b></th>
				<th><b>Update</b></th>
				<th><b>Delete</b></th>
				<th><b>Books</b></th>
			</tr>
		</thead>

		<%-- Fetching the attributes of the request object
				which was previously set by the servlet "ViewSerlet.java" --%>
		<tbody>
			<c:forEach var="bookstore" items="${bookstoreList}">
				<tr>
					<td><c:out value="${bookstore.getName()}" /></td>
					<td><c:out value="${bookstore.getAddress()}" /></td>
					<td><c:out value="${bookstore.getTel()}" /></td>
					<td><a
						href="edit?storeId=<c:out value='${bookstore.getId()}'/>"><button
								type="button" class="update">Update</button></a></td>
					<td><a
						href="delete?storeId=<c:out value='${bookstore.getId()}'/>"><button
								type="button"
								onclick="return confirm('Are you sure you want to delete this item?');"
								class="delete">Delete</button></a></td>
					<td><a
						href="../book/list?storeId=<c:out value='${bookstore.getId()}'/>"><button
								type="button" class="books">Books</button></a></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>

</body>
</html>