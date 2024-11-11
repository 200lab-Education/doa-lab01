import boto3
import os
import time

def lambda_handler(event, context):
    # CloudFront distribution ID (replace with your distribution ID)
    distribution_id = os.environ.get('DISTRIBUTION_ID')
    
    # Path to invalidate
    path_to_invalidate = os.environ.get('PATH_TO_INVALIDATE')

    # Create CloudFront client
    client = boto3.client('cloudfront')

    # Generate a unique caller reference for each invalidation request
    caller_reference = str(time.time()).replace('.', '')

    # Create the invalidation request
    try:
        response = client.create_invalidation(
            DistributionId=distribution_id,
            InvalidationBatch={
                'Paths': {
                    'Quantity': 1,
                    'Items': [path_to_invalidate]
                },
                'CallerReference': caller_reference
            }
        )
        return {
            'statusCode': 200,
            'body': f"Invalidation created: {response['Invalidation']['Id']}"
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
